import Queue from 'bull'
import WpAPI from 'wpapi';
import {JSDOM} from "jsdom";
import {getSlug} from "../helpers/slug.js";
import {getCategories} from "../helpers/categories.js";
import {PubSub} from "graphql-subscriptions";
export const pubSub = new PubSub();

export const TASK_PROGRESS_UPDATED = 'TASK_PROGRESS_UPDATED';

const taskQueue = new Queue('myJobQueue');
const delay = (duration) =>
    new Promise(resolve => setTimeout(resolve, duration));
taskQueue.process(async (job, done) => {
    const {data: {urls, endpoint, username, password, titleSelector, timeout, contentSelector}} = job;
    const wp = new WpAPI({ endpoint, username, password });
    const countUrls = urls.length;

    //console.log({job, urls, endpoint, username, password, titleSelector, timeout, contentSelector})

    urls.reduce((p, url, index, arr) => p.then(async (prev) => {
        job.progress(Math.ceil((index + 1) * 100 / countUrls)).catch((err)=>console.log(err));
        console.log({progress: Math.ceil((index + 1) * 100 / countUrls) , url, job})
        await delay(timeout);
        try {

            const {window: {document}} = await JSDOM.fromURL(url);

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

            const content = document.querySelector(contentSelector).outerHTML;

            // const categories = await slugCategories.reduce(
            //     (promise, category) =>
            //         promise.then(async ({id: parent = 0}) =>
            //             await wp.categories().slug(category) ||
            //             await wp.categories().create({slug: category, parent})
            //         ),
            //     Promise.resolve()
            // );

            //console.log({slug, title, content, slugCategories})

            await wp.posts().create({
                title,
                slug,
                content,
                status: 'publish'
            })

        } catch (e){
            console.log(e.message)
        }

    }), Promise.resolve()).finally(() =>     {
        console.log('done')
        done()
    });

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

// taskQueue.on('global:progress', (id, progress) => {
//     pubSub.publish(TASK_PROGRESS_UPDATED, { taskProgressUpdated: { id, progress } });
// });

export default taskQueue;