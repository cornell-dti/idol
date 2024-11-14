import React from 'react';
import { ALL_ROLES } from 'common-types/constants';
import { Label, Segment, Search, SearchResultProps } from 'semantic-ui-react';
import { Member } from '../../../API/MembersAPI';
import { useMembers, useTeamNames } from '../FirestoreDataProvider';

type SearchState<T> = {
  loading: boolean;
  results: T[];
  value: string;
};

type Action<T> = {
  type: 'CLEAN_QUERY' | 'START_SEARCH' | 'FINISH_SEARCH' | 'UPDATE_SELECTION';
  query: string;
  results: T[];
  selection: string;
};

const allRoleForSearch: { role: Role }[] = ALL_ROLES.map((role) => ({ role }));

function makeInitialState<T>() {
  const initialState: SearchState<T> = {
    loading: false,
    results: [],
    value: ''
  };
  return initialState;
}

function makeReducer<T>() {
  return (state: SearchState<T>, action: Action<T>) => {
    switch (action.type) {
      case 'CLEAN_QUERY':
        return makeInitialState<T>();
      case 'START_SEARCH':
        return { ...state, loading: true, value: action.query };
      case 'FINISH_SEARCH':
        return { ...state, loading: false, results: action.results };
      case 'UPDATE_SELECTION':
        return { ...state, value: '' };

      default:
        throw new Error();
    }
  };
}

type CustomSearchProps<T> = {
  source: readonly T[];
  resultRenderer?: (props: SearchResultProps) => React.ReactElement;
  matchChecker: (input: string, object: T) => boolean;
  selectCallback: (selected: T) => void;
};

export function memberMatchChecker(query: string, member: Member): boolean {
  const queryLower = query.toLowerCase();
  return (
    (member.email && member.email.toLowerCase().startsWith(queryLower)) ||
    (member.firstName && member.firstName.toLowerCase().startsWith(queryLower)) ||
    (member.lastName && member.lastName.toLowerCase().startsWith(queryLower)) ||
    (member.role && member.role.toLowerCase().startsWith(queryLower)) ||
    ((member.firstName &&
      member.lastName &&
      `${member.firstName.toLowerCase()} ${member.lastName.toLowerCase()}`.startsWith(
        queryLower
      )) as boolean)
  );
}

export default function CustomSearch<T>({
  source,
  resultRenderer,
  matchChecker,
  selectCallback
}: CustomSearchProps<T>): JSX.Element {
  const [state, dispatch] = React.useReducer(makeReducer<T>(), makeInitialState<T>());

  const { loading, results, value } = state as SearchState<T>;

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = React.useCallback(
    (e, data) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      dispatch({
        type: 'START_SEARCH',
        query: data.value,
        selection: '',
        results: state.results
      });
      timeoutRef.current = setTimeout(() => {
        if (data.value.length === 0) {
          dispatch({
            type: 'CLEAN_QUERY',
            query: data.value,
            selection: '',
            results: state.results
          });
          return;
        }

        const isMatch = matchChecker;

        dispatch({
          type: 'FINISH_SEARCH',
          results: source.filter((val) => isMatch(data.value, val)),
          selection: '',
          query: data.value
        });
      }, 300);
    },
    [matchChecker, source, state.results]
  );
  React.useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  return (
    <Search
      data-testid="Search"
      loading={loading}
      onResultSelect={(e, data) => {
        dispatch({
          type: 'UPDATE_SELECTION',
          selection: data.result.title,
          query: data.value || '',
          results: state.results
        });
        selectCallback(data.result as T);
      }}
      onSearchChange={handleSearchChange}
      resultRenderer={resultRenderer}
      results={results}
      value={value}
    />
  );
}

export function MemberSearch({ onSelect }: { onSelect: (member: Member) => void }): JSX.Element {
  const allMembers = useMembers();
  return (
    <CustomSearch
      source={allMembers}
      resultRenderer={(mem) => (
        <Segment>
          <h4>{`${mem.firstName} ${mem.lastName}`}</h4>
          <Label>{mem.email}</Label>
        </Segment>
      )}
      matchChecker={memberMatchChecker}
      selectCallback={onSelect}
    />
  );
}

export function TeamSearch({ onSelect }: { onSelect: (team: string) => void }): JSX.Element {
  const teams = useTeamNames().map((it) => ({ title: it }));
  return (
    <CustomSearch
      source={teams}
      resultRenderer={(team) => (
        <Segment key={team.title}>
          <h4>{team.title}</h4>
        </Segment>
      )}
      matchChecker={(query, team) => team.title.toLowerCase().includes(query.toLowerCase())}
      selectCallback={({ title }) => onSelect(title)}
    />
  );
}

export function RoleSearch({
  onSelect,
  roles
}: {
  onSelect: (role: { role: Role }) => void;
  roles?: { role: Role }[];
}): JSX.Element {
  return (
    <CustomSearch
      source={roles ?? allRoleForSearch}
      resultRenderer={(role) => (
        <Segment>
          <h4>{role.role as string}</h4>
        </Segment>
      )}
      matchChecker={(query, role) => role.role.toLowerCase().includes(query)}
      selectCallback={onSelect}
    />
  );
}
