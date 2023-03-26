import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncoderService {

    async encodeDataBasePassword(password: string): Promise<String> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    async checkEncodePassword(
        incomingPassword: string,
        encodePassword: string,
    ): Promise<Boolean> {

        return await bcrypt.compare(
            incomingPassword,
            await this.encodeDataBasePassword(encodePassword),
        );
    }
}
