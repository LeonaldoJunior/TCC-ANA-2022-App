
const GetCaixasDagua = ()=>{
    // return fetch('https://tccana-backend.azurewebsites.net/CaixaAgua')
    return fetch('https://78aa-138-204-26-214.ngrok.io/CaixaAgua')
    .then((response) => response.json())
    // .then((json) => {
    //     console.log(json);
    // })
    .catch((error) => {
    console.error(error);
    });

}


// function getMoviesFromApiAsync() {
//     return fetch('Your URL to fetch data from')
//     .then((response) => response.json())
//     .then((responseJson) => {
//     return responseJson.movies;
//     })
//     .catch((error) => {
//     console.error(error);
//     });
//     }


export default GetCaixasDagua;
