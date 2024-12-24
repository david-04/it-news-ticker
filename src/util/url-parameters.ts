//----------------------------------------------------------------------------------------------------------------------
// Retrieve URL parameters
//----------------------------------------------------------------------------------------------------------------------

export const urlParameters = {
    getPassword: () => getParameter("password"),
    getDate: () => getParameter("date"),
};

function getParameter(key: string) {
    return window.location.hash
        .replace(/^#/, "")
        .split(",")
        .map(parameter => parameter.trim())
        .map(parameter => ({ key: parameter.replace(/=.*/, ""), value: parameter.replace(/[^=]*=/, "") }))
        .filter(parameter => parameter.key === key)[0]?.value;
}
