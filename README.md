Redux X Action
==============
A tool helps creating smart (sync or async) redux action.

## Installation

```
npm install --save redux-x-action
```

Then, to enable Redux X Action:

```js
import { createStore, applyMiddleware } from 'redux';
import { createXMiddleware, createXReducer } from 'redux-x-action';

// Note: this API requires redux@>=3.1.0
const store = createStore(
  combineReducers( {
    xReducer: createXReducer()
  } ),
  applyMiddleware( 
    createXMiddleware() 
  )
);
```

## Basic Usage

Update state (Synchronous): 
```js
// dispatch
...
function updateState(newState) {
  return {
    type: 'UPDATE_STATE',
    xAction: {
      xStateName: 'stateName',
      xStateData: newState
    }
  };
}

store.dispatch(updateState('New State'));
...

// props mapping
...
const mapStateToProps = state => {
  return {
    // 'New State'
    propName: state.xReducer.stateName
  }
};
...
```

Update state (Asynchronous): 
```js
// dispatch
...
function updateState(newState) {
  return {
    type: 'UPDATE_STATE',
    xAction: {
      xStateName: 'stateName',
      xAsync: () => {
        let promise = new Promise(resolve => setTimeout(() => resolve(newState), 1000));
        return promise;
      }
    }
  };
}

store.dispatch(updateState('New State'));
...

// props mapping
...
const mapStateToProps = ( state ) => {
  return {
    // success: 'New State', failure: error object 
    propName: state.xReducer.stateName, 
    // async status: X_STATE_VALUE_ASYNC_RUNNING, X_STATE_VALUE_ASYNC_SUCCESS or X_STATE_VALUE_ASYNC_FAILURE
    // import { X_STATE_VALUE_ASYNC_RUNNING, X_STATE_VALUE_ASYNC_SUCCESS, X_STATE_VALUE_ASYNC_FAILURE } from 'redux-x-action';
    propAsyncStatus: state.xReducer.xAsyncStatus, 
    // 'UPDATE_STATE'
    propAsyncType: state.xReducer.xAsyncType
  }
};
...
```

## Advanced Usage
Update state (Synchronous): 
```js
// dispatch
...
function updateState(newState) {
  return {
    type: 'UPDATE_STATE',
    xAction: {
      xData: {
        stateName: newState
      }
    }
  };
}

or 

function updateState(newState) {
  return {
    type: 'UPDATE_STATE',
    xAction: {
      xData: ( state, action ) => {
        if ( action.type === 'UPDATE_STATE' ) {
            return {
                ...state, 
                stateName: newState
            };
        }
        return state;
      }
    }
  };
}

store.dispatch(updateState('New State'));
...

// props mapping
...
const mapStateToProps = ( state ) => {
  return {
    // 'New State'
    propName: state.xReducer.stateName
  }
};
...
```

Update state (Asynchronous): 
```js
// dispatch
...
function updateState(newState) {
  return {
    type: 'UPDATE_STATE',
    xAction: {
      xStateName: 'stateName',
      xAsync: dispatch => {
        let promise = new Promise(resolve => setTimeout(() => resolve(newState), 1000));
        return promise;
      },
      xAsyncStatusStateName: 'asyncStatus'
    }
  };
}

or 

function updateState(newState) {
  return {
    type: 'UPDATE_STATE',
    xAction: {
      xStateName: 'stateName',
      xAsync: dispatch => {
        let promise = new Promise(resolve => setTimeout(() => resolve(newState), 1000)).then( res => {
            // do another dispatch
            dispatch( {
                type: 'ANOTHER_UPDATE_STATE', 
                xAction: {
                    xStateName: 'anotherStateName',
                    xStateData: 'anotherStateData'
                }
            } );
        } );
        return promise;
      },
      xAsyncRunning: {
        asyncStatus: 'running'
      }, 
      xAsyncSuccess: {
        asyncStatus: 'success'
            }, 
      xAsyncFailure: {
        asyncStatus: 'failure'
      }
    }
  };
}

store.dispatch(updateState('New State'));
...

// props mapping
...
const mapStateToProps = ( state ) => {
  return {
    // success: 'New State', failure: error object 
    propName: state.xAction.stateName, 
    // async status: 'running', 'success' and 'failure' as above
    propAsyncStatus: state.xAction.asyncStatus
  }
};
...
```


## License
Apache-2.0