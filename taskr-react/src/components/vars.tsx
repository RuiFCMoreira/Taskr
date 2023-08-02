
const backend_ip = process.env.REACT_APP_BACKEND_IP || 'localhost'
const hostname = `http://${backend_ip}:8080/api/`

export {hostname}