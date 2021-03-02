import React from 'react'
import { Search, SearchResultProps } from 'semantic-ui-react'
import styles from './Search.module.css';

type SearchState<T> = {
  loading: boolean,
  results: T[],
  value: string
}

type Action<T> = {
  type: 'CLEAN_QUERY' | 'START_SEARCH' | 'FINISH_SEARCH' | 'UPDATE_SELECTION',
  query: string,
  results: T[],
  selection: string
}

function makeInitialState<T>() {
  const initialState: SearchState<T> = {
    loading: false,
    results: [],
    value: '',
  };
  return initialState;
}

function makeReducer<T>() {
  return (state: SearchState<T>, action: Action<T>) => {
    switch (action.type) {
      case 'CLEAN_QUERY':
        return makeInitialState<T>()
      case 'START_SEARCH':
        return { ...state, loading: true, value: action.query }
      case 'FINISH_SEARCH':
        return { ...state, loading: false, results: action.results }
      case 'UPDATE_SELECTION':
        return { ...state, value: '' }

      default:
        throw new Error()
    }
  }
}

type resultRenderer<T> = ((props: SearchResultProps) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any>)>) | undefined;
type matchChecker<T> = (input: string, object: T) => boolean;

type CustomSearchProps<T> = {
  source: T[];
  resultRenderer: resultRenderer<T>;
  matchChecker: matchChecker<T>;
  selectCallback: (selected: T) => any;
}

const CustomSearch: React.FC<CustomSearchProps<any>> = function <T>({ source, resultRenderer, matchChecker, selectCallback }: CustomSearchProps<T>) {
  const [state, dispatch] = React.useReducer(makeReducer<T>(), makeInitialState<T>());

  const { loading, results, value } = state as SearchState<T>;

  const timeoutRef = React.useRef<any>();
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({
      type: 'START_SEARCH', query: data.value, selection: '', results: state.results
    });
    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY', query: data.value, selection: '', results: state.results })
        return
      }

      const isMatch = matchChecker;

      dispatch({
        type: 'FINISH_SEARCH',
        results: source.filter(val => isMatch(data.value, val)).map(val => ({ ...val, title: JSON.stringify(val) })),
        selection: '',
        query: data.value
      })
    }, 300);
  }, [matchChecker, source, state.results])
  React.useEffect(() => () => {
      clearTimeout(timeoutRef.current)
    }, [])

  return (
    <Search
      data-testid="Search"
      loading={loading}
      onResultSelect={(e, data) => {
        dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title, query: data.value || '', results: state.results })
        selectCallback(data.result as T);
      }
      }
      className={styles.search}
      onSearchChange={handleSearchChange}
      resultRenderer={resultRenderer}
      results={results}
      value={value}
    />
  )
}

export default CustomSearch;
