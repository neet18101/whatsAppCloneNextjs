export const HOST = "http://localhost:8080";

const AUTH_ROUTE = `${HOST}/api/v1/auth`;
const MESSAGES_ROUTE = `${HOST}/api/v1/messages`;

export const CHECK_USER_ROTUE = `${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`;
export const GET_ALL_CONTACTS = `${AUTH_ROUTE}/get-contacts`;

export const ADD_MESSSAGE_ROUTE = `${MESSAGES_ROUTE}/add-message`;
