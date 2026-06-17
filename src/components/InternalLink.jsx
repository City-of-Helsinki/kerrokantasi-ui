import classNames from 'classnames';
import PropTypes from 'prop-types';

const SCROLL_OFFSET = 100;

function InternalLink({ children, destinationId, srOnly = false, className }) {
  const handleClick = (e) => {
    e.preventDefault();
    const target = document.getElementById(destinationId);
    if (target) {
      const top =
        target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
      if (!target.hasAttribute('tabIndex')) {
        target.setAttribute('tabIndex', '-1');
      }
      target.focus({ preventScroll: true });
    }
  };

  return (
    <a
      className={classNames(
        srOnly ? 'internal-link hidden-link' : 'internal-link',
        className
      )}
      href={`#${destinationId}`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

InternalLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  destinationId: PropTypes.string.isRequired,
  srOnly: PropTypes.bool,
  className: PropTypes.string,
};

export default InternalLink;
