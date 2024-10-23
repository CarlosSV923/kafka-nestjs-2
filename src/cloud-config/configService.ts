import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as config from 'config';
import { from, lastValueFrom, map, retry } from 'rxjs';

export const configService = async () => {

    const logger = new Logger('ConfigService');
    const configServer = config.get<string>('configuration.cloud.url');

    if (!configServer) {
        console.log('Config Server not enabled');
        return {};
    }

    return lastValueFrom(
        from(axios.get(`${configServer}/config`))
            .pipe(
                retry(3),
                map(response => {
                    logger.log('Config loaded from config server', response.data);
                    return response.data
                }),
            )
    );
}