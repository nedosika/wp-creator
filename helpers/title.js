import axios from "axios";

export const fetchTitleFormPost = async ({url}, parser) => {
    const {index, regExp} = parser;
    const results = await axios(url).then(({data}) => data.match(new RegExp(regExp)));
    return results[index];
}