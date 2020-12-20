import _ from 'lodash';

export default async function fetchUrl({ url, method = 'GET', data = {} }) {
    let result = {};
    let setting = {
        method: method,
        // body: JSON.stringify(data)
    };

    if (!_.isEmpty(data)) {
        url = `${url}/param=${JSON.stringify(data)}`;
    }
    // if (_.isEmpty(data) || method === 'GET') { delete setting.body; }


    try {
        const response = await fetch(url, setting);
        result = await response.json();
    } catch (e) {
        console.error(e);
    }
    console.log(result);
    return result;
}