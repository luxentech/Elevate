/* Elevate: keeps shared site data in the database instead of the browser.
   The legacy app still calls localStorage, so this adapter intercepts only
   shared-data keys, serves them from memory, mirrors them to a local cache
   (offline safety net) and persists them to the database. */
(function () {
  var KEYS = [
    'luxen_general_cards',
    'luxen_partners',
    'luxen_comments',
    'luxen_likes',
    'luxen_all_users',
    'luxen_notifications',
    'luxen_category_status'
  ];
  var API = '/api/public/store';
  var CACHE_PREFIX = '__elevate_cache__';
  var sharedStore = {};
  var pending = {};      // key -> latest raw value waiting to be sent
  var inflight = {};     // key -> true while a POST is running
  var dirty = {};        // key -> true until the server confirms the write

  var proto = window.Storage.prototype;
  var nativeGet = proto.getItem;
  var nativeSet = proto.setItem;
  var nativeRemove = proto.removeItem;

  function isSharedKey(key) {
    return KEYS.indexOf(key) !== -1;
  }

  function cacheWrite(key, raw) {
    try {
      if (raw === null) nativeRemove.call(window.localStorage, CACHE_PREFIX + key);
      else nativeSet.call(window.localStorage, CACHE_PREFIX + key, raw);
    } catch (e) {}
  }

  function cacheRead(key) {
    try {
      return nativeGet.call(window.localStorage, CACHE_PREFIX + key);
    } catch (e) {
      return null;
    }
  }

  function applyServerStore(store) {
    KEYS.forEach(function (k) {
      if (dirty[k]) return; // keep local edits that are not confirmed yet
      if (store && Object.prototype.hasOwnProperty.call(store, k) && store[k] !== null) {
        var raw = JSON.stringify(store[k]);
        sharedStore[k] = raw;
        cacheWrite(k, raw);
      } else {
        delete sharedStore[k];
        cacheWrite(k, null);
      }
    });
  }

  // 0) Seed from the local cache so the UI never renders empty if the network is slow/down.
  KEYS.forEach(function (k) {
    var cached = cacheRead(k);
    if (cached !== null) sharedStore[k] = cached;
  });

  // 1) Pull current DB state before the legacy app starts.
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', API + '?t=' + Date.now(), false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 300) {
      var payload = JSON.parse(xhr.responseText);
      applyServerStore((payload && payload.data) || {});
    }
  } catch (e) {
    console.warn('[Elevate] could not load data from database, using local cache', e);
  }

  // 2) Persist writes to the database, one request at a time per key, with retry.
  function flush(key) {
    if (inflight[key] || !Object.prototype.hasOwnProperty.call(pending, key)) return;
    var raw = pending[key];
    delete pending[key];
    inflight[key] = true;

    var value;
    try {
      value = raw === null ? null : JSON.parse(raw);
    } catch (e) {
      value = raw;
    }

    fetch(API, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: key, value: value }),
      keepalive: true
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        inflight[key] = false;
        if (!Object.prototype.hasOwnProperty.call(pending, key)) dirty[key] = false;
        flush(key);
      })
      .catch(function () {
        inflight[key] = false;
        // retry the newest value shortly
        if (!Object.prototype.hasOwnProperty.call(pending, key)) pending[key] = raw;
        setTimeout(function () { flush(key); }, 3000);
      });
  }

  function push(key, raw) {
    dirty[key] = true;
    pending[key] = raw;
    flush(key);
  }

  proto.getItem = function (key) {
    if (this === window.localStorage && isSharedKey(key)) {
      return Object.prototype.hasOwnProperty.call(sharedStore, key) ? sharedStore[key] : null;
    }
    return nativeGet.call(this, key);
  };

  proto.setItem = function (key, value) {
    if (this === window.localStorage && isSharedKey(key)) {
      var raw = String(value);
      sharedStore[key] = raw;
      cacheWrite(key, raw);
      nativeRemove.call(this, key);
      push(key, raw);
      return;
    }
    nativeSet.call(this, key, value);
  };

  proto.removeItem = function (key) {
    if (this === window.localStorage && isSharedKey(key)) {
      var empty = key === 'luxen_likes' || key === 'luxen_category_status' ? '{}' : '[]';
      sharedStore[key] = empty;
      cacheWrite(key, empty);
      nativeRemove.call(this, key);
      push(key, empty);
      return;
    }
    nativeRemove.call(this, key);
  };

  // Remove shared-data leftovers written by older versions of the site.
  KEYS.forEach(function (key) { nativeRemove.call(window.localStorage, key); });

  function rerender() {
    try {
      if (window.App) {
        if (typeof App.renderPartners === 'function') App.renderPartners();
        if (typeof App.renderOpportunities === 'function') App.renderOpportunities();
        if (typeof App.updateHomeStats === 'function') App.updateHomeStats();
      }
      if (window.Admin && typeof Admin.init === 'function' &&
          document.getElementById('admin-manage-partners-list')) {
        Admin.init();
      }
    } catch (e) {}
  }

  function refresh(silent) {
    return fetch(API + '?t=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (p) {
        var store = (p && p.data) || {};
        applyServerStore(store);
        if (!silent) rerender();
        return store;
      })
      .catch(function () { return null; });
  }

  // 3) Keep every open tab / device in sync.
  var hasPendingWork = function () {
    for (var k in dirty) if (dirty[k]) return true;
    return false;
  };

  setInterval(function () {
    if (document.hidden || hasPendingWork()) return;
    refresh(false);
  }, 15000);

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && !hasPendingWork()) refresh(false);
  });

  window.ElevateDB = { keys: KEYS, refresh: refresh };
})();
