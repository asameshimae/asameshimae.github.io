var _templateObject5 = _taggedTemplateLiteral2(['-'], ['-']);

function _taggedTemplateLiteral2(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _templateObject = _taggedTemplateLiteral(['&'], ['&']),
    _templateObject2 = _taggedTemplateLiteral(['='], ['=']),
    _templateObject3 = _taggedTemplateLiteral(['-'], ['-']),
    _templateObject4 = _taggedTemplateLiteral([','], [',']);

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function _taggedTemplateLiteral(strings, raw) {
  return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

/* constants */

var trophmoji = '🏆'; // trophy emoji 
var keyGS = 'AKfycbyaikUC17up2E2Pbt8L1qF0-GxTsyFnY7YbLA9Eg4Hni0-eAWM'; // key to the Google Sheet (prod)
var query = new Map(location.search.substr(1).split(_templateObject).map(function (p) {
  return p.split(_templateObject2);
})); // make a map out of the url query string

var scheduledUpdate = false; // id of any pending update for cancelling
var inputs = [],
    saveStatuses = []; // array from nodelist of inputs - populated after they are created dynamically
var fields = {};
var todo = [false, false]; // array of sections which should be highlighted as next up

/* general reusable functions */

// capitalise first letter of a string
var initCap = function initCap(string) {
  return string[0].toUpperCase() + string.substr(1);
};

// tee function: log object to console and return the object. useful for chaining while debugging
var tee = function tee(obj) {
  console.log(obj);return obj;
};

// get ready to do an update if no more changes in next 500ms
var scheduleUpdate = function scheduleUpdate() {
  if (scheduledUpdate) clearTimeout(scheduledUpdate); // cancel any existing update
  scheduledUpdate = setTimeout(function () {
    return sendUpdate();
  }, 500); // schedule a new update
  saveStatuses.forEach(function (e) {
    return e.textContent = textStatus().saving;
  });
};

// check if `that` contains all the key value pairs of `this` e.g. {a:1,b:2}.isIn({a:1,b:2,c:3})===true
Object.prototype.isIn = function (that) {
  var _this = this;

  return Object.keys(this).every(function (key) {
    return _this[key] === that[key];
  });
};

/* static templates */
var vHeaderEng = '<th rowspan="3" class="narrow"><div class="rotate">Engagement &rarr;</div></th>';
// const hHeaderUnd = `<tr><td colspan="2">&nbsp;</td><th colspan="3">Understanding &rarr;</th></tr><tr class="horizBlock"><td colspan="2">&nbsp;</td>${[0,1,2].map(und=>`<th class="keyCol">${initCap(textDescriptors.understanding.short[und])}</th>`).join('')}</tr>`
var urlReq = 'https://script.google.com/macros/s/' + keyGS + '/exec?a=' + query.get('a') + '&b=' + query.get('b') + '&res=1'; // generate the url to get data

/* dynamic template functions */
var textStatus = function textStatus() {
  return {
    saving: 'Saving...',
    saved: 'Last saved ' + ('' + new Date()).split(' ')[4] + '.',
    error: 'Error saving data. Please contact us.'
  };
};

var urlSend = function urlSend(data) {
  return 'https://script.google.com/macros/s/' + keyGS + '/exec?a=' + query.get('a') + '&b=' + query.get('b') + '&data=' + data;
}; // generate the url to send an update
var drawGridOption = function drawGridOption(topic, eng, und) {
  return '<td><input type="radio" name="' + topic + '" value="' + (und + 3 * eng) + '" data-understanding="' + und + '" data-engagement="' + eng + '" id="' + topic[0] + eng + und + '">\n  <label for="' + topic[0] + eng + und + '">' + initCap(topic) + ': ' + initCap(textDescriptors.understanding.long[und]) + ', ' + textDescriptors.engagement.long[eng] + '</label></td>';
};
// const drawGridRow = (topic,eng)=>`<tr>${eng===2?vHeaderEng:""}<th class="keyRow">${initCap(textDescriptors.engagement.short[eng])}</th>${[0,1,2].map(und=>drawGridOption(topic,eng,und)).join('')}</tr>`
// const drawGrid = (topic)=>`${hHeaderUnd}${[2,1,0].map(eng=>drawGridRow(topic,eng)).join('')}`
var drawGrid = function drawGrid() {
  return '';
};
// const flattenInputs2D = ()=>JSON.stringify(inputs.filter(e=>e.checked).map(e=>({[e.name.split`-`[0]]: e.dataset})))
var validUsername = function validUsername() {
  return fields.mUser.value.trim().match(/^@?[_A-Za-z0-9]+$/g) !== null;
};
var validNumber = function validNumber() {
  return fields.mNumber.value.trim().match(/[0-9]+/g) !== null;
};
var checkUsername = function checkUsername() {
  if (fields.mWindows.value) {
    document.querySelector('#session0 .reveal').style.display = 'none';
    todo[0] = false;
    // location.hash = '#session' + todo.indexOf(true);
  }
}; // if the URL field is valid, make it appear so, otherwise make it appear invalid

var flattenInputs = function flattenInputs() {
  var r = {};
  inputs.filter(function (e) {
    return e.checked && e.type !== 'text';
  }).map(function (e) {
    return [].concat(_toConsumableArray(e.name.split(_templateObject3)), [e.value]);
  }).forEach(function (e) {
    r[e[0]] = r[e[0]] || {}; // initialise the topic within return object if necessary
    r[e[0]][e[1]] = e[2]; // set topic.axis=level based on the triplet above
  });
  inputs.filter(function (e) {
    return e.type === 'text' && e.name.split(_templateObject3)[1];
  }).map(function (e) {
    return [].concat(_toConsumableArray(e.name.split(_templateObject3)), [e.value]);
  }).forEach(function (e) {
    r[e[0]] = r[e[0]] || {};
    r[e[0]][e[1]] = e[2].trim();
  });
  checkUsername();
  return JSON.stringify(r);
};

var deTrophy = function deTrophy(text) {
  return text.replace(new RegExp('^[' + trophmoji + ' ]+'), '');
};
var enTrophy = function enTrophy(text) {
  return trophmoji + ' ' + deTrophy(text);
};

var checkComplete = function checkComplete() {
  allComplete = true;
  document.querySelectorAll('.set').forEach(function (s) {
    setComplete = Array.from(s.querySelectorAll('input')).every(function (i) {
      return i.checked;
    });
    allComplete = setComplete && allComplete;
    setName = s.querySelector('input').name.split(_templateObject5)[0];
    h2 = s.querySelector('h2');
    if (setComplete) {
      h2.textContent = enTrophy(h2.textContent);
      s.classList.add('complete');
    } else {
      h2.textContent = deTrophy(h2.textContent);
      s.classList.remove('complete');
    }
  });
  if (allComplete) {
    document.querySelector('#bingo').style.display = 'block';
  } else {
    document.querySelector('#bingo').style.display = 'none';
  }
};

/* rendering functions - called once */
var setInput2D = function setInput2D(topic, ratings) {
  return inputs.filter(function (e) {
    return e.name.split(_templateObject3)[0] === topic && e.dataset.isIn(ratings);
  })[0].checked = true;
}; // check an input if it appears in the supplied topic/ratings data
var setInput = function setInput(topic, axis, value) {
  return [].concat(_toConsumableArray(document.querySelectorAll('[name="' + topic + '-' + axis + '"]'))).forEach(function (e) {
    if (e.type === 'text') {
      e.value = value;
      checkUsername();
    } else if (e.value === value) e.checked = true;
  });
};
var setInputs2D = function setInputs2D(data) {
  return data.forEach(function (datum) {
    return setInput2D(topic = Object.keys(datum)[0], datum[topic]);
  });
}; // go through ratings data and check all relevant inputs
var setInputs = function setInputs(data) {
  return Object.keys(data).map(function (e) {
    return Object.keys(data[e]).forEach(function (l) {
      return setInput(e, l, data[e][l]);
    });
  });
}; // go through ratings data and check all relevant inputs
var setWindows = function setWindows() {
  checkComplete();
  return fields.mWindows.value = query.get('a').replace('%40', '@');
};

// draw all the grids on the page to allow listeners to be set up and data to be populated
var drawGrids = new Promise(function (resolve, reject) {
  try {
    grids = [].concat(_toConsumableArray(document.querySelectorAll('table.grid')));
    grids.forEach(function (target) {
      return target.insertAdjacentHTML('beforeend', drawGrid(target.dataset.topic));
    });
    inputs = [].concat(_toConsumableArray(document.querySelectorAll('input,button'))); // set the inputs variable for subsequent functions
    saveStatuses = [].concat(_toConsumableArray(document.querySelectorAll('.saveStatus'))); // fields to update with save status
    'mUser,mUserTip,mWindows,mNumber'.split(_templateObject4).forEach(function (e) {
      return fields[e] = document.querySelector('#' + e);
    });
    // mUser = document.querySelector('#mUser')
    // mUserTip = document.querySelector('#mUserTip')
    // mWindows = document.querySelector('#mWindows')
    resolve(true);
  } catch (e) {
    reject(Error(e));
  }
});

// set up event listeners on the page to autosave any changes, also update display based on data
var initListeners = new Promise(function (resolve, reject) {
  try {
    inputs.forEach(function (e) {
      return e.addEventListener(e.type === 'text' ? 'input' : 'click', function () {
        checkComplete();
        return scheduleUpdate();
      });
    });
  } catch (e) {
    reject(Error(e));
  }
  resolve(true);
});

// request the last save state and apply it
var reqUpdate = new Promise(function (resolve, reject) {
  try {
    fetch(urlReq).then(function (r) {
      return r.json();
    }).then(function (json) {
      return json.result === 'ok' && json.data.length ? JSON.parse(json.data[0].data) : false;
    }).then(setInputs).then(setWindows);
    // .then(setInputs2D)
  } catch (e) {
    reject(Error(e));
  }
  resolve(true);
});

/* live functions - called as required */
// const sendUpdate = () => fetch(urlSend(flattenInputs2D())).then(r=>r.json()).then(console.log) // send the save state to the server
var sendUpdate = function sendUpdate() {
  return fetch(urlSend(flattenInputs())).then(function (r) {
    return tee(r.json());
  }).then(function (e) {
    return console.log(e.result);
  }).then(saveStatuses.forEach(function (e) {
    return e.textContent = textStatus().saved;
  }));
}; // send the save state to the server

// TODO qd to ls, sl

/* app init */
// enable toggle behaviour where script enabled
reva = [].concat(_toConsumableArray(document.querySelectorAll('.reva')));
reva.forEach(function (e) {
  e.style.display = 'block';
  e.addEventListener('click', function (event) {
    event.preventDefault();
    e.nextElementSibling.style.display = e.nextElementSibling.style.display === '' ? 'none' : '';
    return false;
  });
});

if (query.get('a')) {
  document.querySelector('#frmReflect').style.display = 'inline-block';
  drawGrids.then(reqUpdate).then(initListeners); // add event listeners to voting buttons
} else {
  document.querySelector('#b').value = query.get('b');
  document.querySelector('#frmWindows').style.display = 'inline-block';
}
