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
    const {data: {urls, endpoint, username, password, headerSelector, timeout, contentSelector}} = job;
    const wp = new WpAPI({endpoint, username, password});
    const countUrls = urls.length;

    //console.log({job, urls, endpoint, username, password, headerSelector, timeout, contentSelector})

    urls.reduce((p, url, index, arr) => p.then(async (prev) => {
        job.progress(Math.ceil((index + 1) * 100 / countUrls)).catch((err) => console.log(err));
        //console.log({progress: Math.ceil((index + 1) * 100 / countUrls), url})
        await delay(timeout);
        try {

            const {window: {document, close}} = await JSDOM.fromURL(url);

            const slug = getSlug(url);
            const slugCategories = getCategories(url);
            const header = document.querySelector(headerSelector).textContent;
            const title = document.querySelector('title').textContent

            const descriptionElement = document.querySelector('meta[name="description"]');
            const description = descriptionElement ? descriptionElement.getAttribute('content') : '';

            // Access all <img> elements and correct their src attributes
            const imgElements = document.querySelectorAll('img');
            imgElements.forEach((imgElement) => {
                const currentSrc = imgElement.getAttribute('src');
                // Perform correction on the currentSrc as needed
                const correctedSrc = currentSrc.substring(currentSrc.indexOf('/wp-content/'));
                //console.log({correctedSrc});
                imgElement.setAttribute('src', correctedSrc);
            });

            //console.log({description, title})

            const scriptElements = document.querySelectorAll('script');
            scriptElements.forEach((script) => script.remove());

            const content = document
                    .querySelector(contentSelector)
                    .innerHTML
                    .replace(/class="[^"]*"/g, '')
                    .replace(/style="[^"]+"/g, '')
                    .replace(/id="[^"]+"/g, '');

            const categories = await slugCategories.reduce(
                (promise, category) =>
                    promise.then(async ({id: parent = 0}) =>
                        await wp.categories().slug(category) ||
                        await wp.categories().create({slug: category, parent})
                    ),
                Promise.resolve()
            );

            console.log({slug, content, slugCategories, categories, description, title})

            await wp.posts().create({
                title: header,
                slug,
                content,
                meta: {yoast_wpseo_metadesc: description, description},
                status: 'publish',
            }).then(({id}) => wp.posts().id(id).update({meta: {yoast_wpseo_metadesc: description, description}}));

        } catch (e) {
            console.log(e.message)
        }

    }), Promise.resolve()).finally(() => {
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

taskQueue.on('progress', (task, progress) => {
    pubSub.publish(TASK_PROGRESS_UPDATED, {taskProgressUpdated: {...task.data, progress}});
});

export default taskQueue;