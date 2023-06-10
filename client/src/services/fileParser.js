import XMLParser from "react-xml-parser";

export default function fileParser(file){
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
            switch (file.type){
                case "application/json":
                    return resolve(
                        JSON.parse(e.target.result.toString())
                            .map(({urls}) => Object.entries(urls).map(([_, value]) => value)[0])
                            .filter(({mimetype}) => mimetype === 'text/html')
                            .map(({url}) => url)
                    );
                case "text/xml":
                    return resolve(
                        new XMLParser()
                            .parseFromString(e.target.result.toString())
                            .getElementsByTagName('loc')
                            .map((loc) => loc.value)
                    );
                default:
                    reject("Only xml or json file supported!")
            }
        }

        fileReader.onerror = reject;

        fileReader.readAsText(file, 'UTF-8');
    })
}