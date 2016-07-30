import _ from 'lodash';

/** Extends an array rather than known list of objects */
//TODO: Look at using object.assign
export function extendArray(objects) {
  //return an empty object if we don't have anything to combine
  if(!objects) { return {}; }

  //add empty object to the beginning for Object.extend
  objects.unshift({});

  //Buid the combined object
  let combinedObject = _.extend.apply(this, objects);

  //TODO: why are we doing this? is it necessary
  objects.shift();

  //return the combined object
  return combinedObject;
}

//from MDN
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

/**
 * Finds properties on an object that end in specified word
 * @param {string} ending - The string that properties should be found ending with
 * @param {Object} object - The object to find keys on
 */
export function getPropertiesByEnding(ending, object) {
  return Object.keys(object).filter((name) => name.endsWith(ending));
}

/** Creates a new object containing only properties that end with specified ending
 * @param {string} ending - The string that properties should be found ending with
 * @param {Object} object - The object to find keys on
 */
export function getObjectWherePropertyEndsWith(ending, object) {
  const keys = getPropertiesByEnding(ending, object);

  return _.pick(object, keys);
}

/** Creates a new reducer by taking the output of the first reducer as state to the second
 * @param {Object} currentReducer - reducerMethod (state, action) to that we want to run as the state parameter for second reducer
 * @param {Object} previousReducer - reducerMethod (state, action) to run second
 */
export function composeReducer(nextReducer, previousReducer) {
  // compose the reducers when both parameters are functions
  if(typeof(nextReducer) === 'function' && typeof(previousReducer) === 'function') {
    return (state, action) => previousReducer(nextReducer(state, action), action);
  }

  // return the nextReducer
  return nextReducer;
}

export function getReducersByWordEnding(reducers, ending) {
  return reducers.reduce((previous, current) => {
    const keys = Object.keys(current).filter((name) => name.endsWith(ending));

    let reducer = pick(current, keys);

    //TODO: clean this up it's a bit hacky
    for (var key in current) {
      if(!key.endsWith(ending)) { continue; }

      const keyWithoutEnding = key.replace(`_${ending}`, "");
      //make a new method that pipes output of previous into state of current
      //this is to allow chaining these
      const hasPrevious =  previous.hasOwnProperty(keyWithoutEnding) && typeof previous[keyWithoutEnding] === 'function';
      const previousReducer = hasPrevious ?
        previous[keyWithoutEnding] :
        undefined;

      const currentReducer = reducer[key]

      reducer[keyWithoutEnding] = wrapReducer(currentReducer, previousReducer);
    }

    //override anything in previous (since this now calls previous to make sure we have helpers from both);
    return extend(previous, reducer);
  }, {});
}