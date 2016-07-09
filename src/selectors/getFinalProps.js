import memoizeProps from '../utils/memoizeProps'

export function createImpureFinalPropsSelector({ dispatch, getState, getDispatch, mergeProps }) {
  return function impureSelector(state, props) {
    return mergeProps(
      getState(state, props),
      getDispatch(dispatch, props),
      props
    )
  }
}

export function createPureFinalPropsSelector({ dispatch, getState, getDispatch, mergeProps }) {
  const memoizeOwnProps = memoizeProps()
  const memoizeStateProps = memoizeProps()
  const memoizeDispatchProps = memoizeProps()
  const memoizeFinal = memoizeProps()
  let lastOwnProps = undefined
  let lastStateProps = undefined
  let lastDispatchProps = undefined
  let lastFinalProps = undefined

  return function pureSelector(state, props) {
    const nextOwnProps = memoizeOwnProps(props)
    const nextStateProps = memoizeStateProps(getState(state, nextOwnProps))
    const nextDispatchProps = memoizeDispatchProps(getDispatch(dispatch, nextOwnProps))

    if (
      lastOwnProps !== nextOwnProps ||
      lastStateProps !== nextStateProps ||
      lastDispatchProps !== nextDispatchProps
    ) {
      lastFinalProps = memoizeFinal(mergeProps(nextStateProps, nextDispatchProps, nextOwnProps))
      lastOwnProps = nextOwnProps
      lastStateProps = nextStateProps
      lastDispatchProps = nextDispatchProps
    }

    return lastFinalProps
  }
}

export function createFinalPropsSelector(options) {
  return options.pure
    ? createPureFinalPropsSelector(options)
    : createImpureFinalPropsSelector(options)
}