import Queue from 'bull'
import WpAPI from 'wpapi';
import {JSDOM} from "jsdom";
import {getSlug} from "../helpers/slug.js";
import {getCategories} from "../helpers/categories.js";

const taskQueue = new Queue('myJobQueue');
taskQueue.process(({data: {urls, endpoint, username, password, titleSelector, contentSelector}, progress}, done) => {
    const wp = new WpAPI({ endpoint, username, password });
    const countUrls = urls.length;

    console.log(urls, endpoint, username, password, titleSelector, contentSelector)

    urls.reduce((p, url, index, arr) => p.then(async (prev) => {
        //progress(Math.ceil(++index * 100 / countUrls));

        const dom = await JSDOM.fromURL(url, { runScripts: "dangerously" });

        const {document} = dom.window;
        const slug = getSlug(url);
        const slugCategories = getCategories(url);
        const title = document.querySelector(titleSelector).textContent;

        const scriptElements = document.querySelectorAll('script');
        scriptElements.forEach((script) => script.remove());

        const divElements = document.querySelectorAll('div');
        divElements.forEach((div) => {
            if (div.innerHTML.trim() === '') {
                div.remove();
            }
        });

        const pElements = document.querySelectorAll('p');
        pElements.forEach((p) => {
            if (p.innerHTML.trim() === '') {
                p.remove();
            }
        });

        const content = document.querySelector(contentSelector).outerHTML;

        const categories = await slugCategories.reduce(
            (promise, category) =>
                promise.then(async ({id: parent = 0}) =>
                    await wp.categories().slug(category) ||
                    await wp.categories().create({slug: category, parent})
                ),
            Promise.resolve()
        );

        console.log({slug, title, content, categories, slugCategories})

        wp.posts().create({
            title,
            slug,
            content,
            categories,
            status: 'publish'
        })

    }), Promise.resolve()).finally(done);

    // transcode image asynchronously and report progress
    // job.progress(42);
    //
    // // call done when finished
    // done();
    //
    // // or give an error if error
    // done(new Error('error transcoding'));
    //
    // // If the job throws an unhandled exception it is also handled correctly
    // throw new Error('some unexpected error');

    // or pass it a result
});

export default taskQueue;