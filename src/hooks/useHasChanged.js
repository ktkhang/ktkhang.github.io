import usePrevious from './usePrevious';

const useHasChanged = (value) => {
   const prevVal = usePrevious(value);
   return prevVal !== value;
};

export default useHasChanged;
