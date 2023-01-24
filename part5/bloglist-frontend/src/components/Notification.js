export const Notification = ({ message }) => {
  const style = {
    borderStyle: 'solid',
    borderColor: 'gray',
    borderRadius: 5,
    width: '50%'
  }
  if (message.length > 0) {
    return (
      <div style={style}>{message}</div>
    )
  }
}
