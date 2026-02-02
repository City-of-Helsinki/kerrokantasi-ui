import PropTypes from 'prop-types';
/**
 * Conditionally wraps the given children with a wrapper function/component.
 *
 * When {@link condition} is true, the {@link wrap} function is called with
 * {@link children} and its result is rendered. Otherwise, the children are
 * rendered as-is.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.condition - Whether to apply the wrapper.
 * @param {Function} props.wrap - Function that receives children and returns a wrapped React node.
 * @param {React.ReactNode} props.children - The content to optionally wrap.
 * @returns {React.ReactNode} The wrapped or unwrapped children.
 */
export const ConditionalWrap = ({ condition, wrap, children }) => (
  condition ? wrap(children) : children
);
ConditionalWrap.propTypes = {
  condition: PropTypes.bool.isRequired,
  wrap: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};