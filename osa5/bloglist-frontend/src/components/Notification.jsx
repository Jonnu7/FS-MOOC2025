import PropTypes from 'prop-types'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={type === 'error' ? 'error' : 'success'}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['error', 'success']).isRequired,
}

export default Notification