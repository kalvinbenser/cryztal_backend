import log from '../../logger/logger';
import * as AWS from 'aws-sdk';

const ID = 'AKIASGQ26B2YOUETGCM4';
const SECRET = '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';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region: 'ap-south-1',
});

// const CurrentDate = moment().format();

/**
 *
 */
export class ImageUploadService {
    /**
     
     * @param {any} req -- Unique category_id for th table astrologer_id
     * @returns {any} -- DB response SQL Response
     */
    async shopImageUpload(req: any): Promise<any> {
        const image_length = req.files.image.length;

        const image_data = [];
        if (image_length == undefined) {
            const shop = req.files.image;
            const shop_name = shop.name;

            const params = {
                Bucket: 'cryztal-upload', // pass your bucket name
                Key: shop_name, // file will be saved
                Body: shop.data,
                ContentType: 'jpg/jpeg/png',
                ACL: 'public-read',
            };

            const image_l = await this.s3Upload(params);
            image_data.push(image_l);
        }

        if (image_length > 1) {
            for (const i in req.files.image) {
                const shop = req.files.image[i];

                const params = {
                    Bucket: 'cryztal-upload', // pass your bucket name
                    Key: shop.name, // file will be saved as
                    Body: shop.data,
                    ContentType: 'jpg/jpeg/png',
                    ACL: 'public-read',
                };

                const image_l = await this.s3Upload(params);

                image_data.push(image_l);
            }
        }

        try {
            return image_data;
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @param {number} params -- params s3
     */
    async s3Upload(params) {
        return new Promise((resolve) => {
            s3.upload(params, async (err, data) => {
                if (err) {
                    //result(err, null);
                    // console.log('err', err);
                    resolve('');
                } else {
                    const image_link = data.Location;

                    resolve(image_link);
                }
            });
        });
    }
}
