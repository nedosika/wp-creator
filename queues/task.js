import Queue from 'bull'
import WpAPI from 'wpapi';
import {JSDOM} from "jsdom";
import {getSlug} from "../helpers/slug.js";
import {getCategories} from "../helpers/categories.js";
import {PubSub} from "graphql-subscriptions";
import moment from "moment";
export const pubSub = new PubSub();

export const TASK_PROGRESS_UPDATED = 'TASK_PROGRESS_UPDATED';

const taskQueue = new Queue('myJobQueue');
const delay = (duration) =>
    new Promise(resolve => setTimeout(resolve, duration));
taskQueue.process(async (job, done) => {
    const {
        data: {
            urls,
            endpoint,
            username,
            password,
            headerSelector,
            timeout,
            contentSelector,
            dateSelector,
            dateParser,
            dateLocale,
            contentReplacers
        }
    } = job;
    const wp = new WpAPI({endpoint, username, password});
    const countUrls = urls.length;

    // console.log({
    //     urls,
    //     endpoint,
    //     username,
    //     password,
    //     headerSelector,
    //     timeout,
    //     contentSelector,
    //     dateSelector,
    //     dateParser,
    //     dateLocale,
    //     contentReplacers
    // });

    urls.reduce((p, url, index, arr) => p.then(async (prev) => {
        job.progress(Math.ceil((index + 1) * 100 / countUrls)).catch((err) => console.log(err));

        await delay(timeout);

        try {

            const {window: {document, close}} = await JSDOM.fromURL(url);

            const slug = getSlug(url);
            const slugCategories = getCategories(url);
            const header = document.querySelector(headerSelector).textContent;
            const title = document.querySelector('title').textContent
            const date = dateSelector && document.querySelector(dateSelector).textContent

            const publishedTimeElement = document.querySelector('meta[property="article:published_time"]');
            const publishedTime = publishedTimeElement ? publishedTimeElement.getAttribute('content') : new Date();

            const publishedDate = date ? moment(date, dateParser || '', dateLocale || 'ru').toDate() : publishedTime;

            const descriptionElement = document.querySelector('meta[name="description"]');
            const description = descriptionElement ? descriptionElement.getAttribute('content') : '';

            // Access all <img> elements and correct their src attributes
            const imgElements = document.querySelectorAll('img');
            imgElements.forEach((imgElement) => {
                const currentSrc = imgElement.getAttribute('src');
                const correctedSrc = currentSrc.substring(currentSrc.indexOf('/wp-content/'));
                imgElement.setAttribute('src', correctedSrc);
            });

            const scriptElements = document.querySelectorAll('script');
            scriptElements.forEach((script) => script.remove());

            const content = contentReplacers.reduce((result, replacer) => result.replace(new RegExp(replacer, 'g'), '')
            , document.querySelector(contentSelector).innerHTML);

            const categories = await slugCategories.reduce(
                (promise, category) =>
                    promise.then(async ({id: parent = 0}) =>
                        await wp.categories().slug(category) ||
                        await wp.categories().create({slug: category, parent})
                    ),
                Promise.resolve()
            );

            // console.log({
            //     slug,
            //     content,
            //     slugCategories,
            //     categories,
            //     description,
            //     title,
            //     publishedDate
            // })

            await wp.posts().create({
                title: header,
                slug,
                content,
                yoast_meta: {
                    yoast_wpseo_title: title,
                    yoast_wpseo_metadesc: description,
                    //yoast_wpseo_canonical: "http://my-wordpress-site.test/testy-test"
                },
                date: publishedDate,
                status: 'publish',
            })

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