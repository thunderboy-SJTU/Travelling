
// get function
export function get(url, params, callback){
    if (params) {
        let paramsArray = [];

        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    fetch(url,{
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status === 0){
                alert("Response Failed")
            }
            else {
                callback(responseData.data)
            }
        })
        .catch((error) => {
            alert(error)
        })
}

//post function
export function post(url, data, callback){
    let formData = new FormData();
    for (let name in data){
        formData.append(name, data[name])
    }

    fetch(url,{
        method:'POST',

        headers: {
            'Content-Type': 'multipart/form-data;charset=utf-8'
        },
        body:formData
    })
        .then((response) => response.json() )
        .then((responseData)=>{
            if(responseData.status === 0){
                alert("Response Failed")
            }
            else {
                callback(responseData.data)
            }
        })
        .catch((error)=>{
            alert(error)
        });
}

