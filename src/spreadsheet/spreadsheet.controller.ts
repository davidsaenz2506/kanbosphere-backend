import { Body, Controller, Param, Post } from '@nestjs/common';
import { SpreadSheetService } from './spreadsheet.service';
import { QueryParamsDTO } from 'src/dto/queryparam.dto';


@Controller('spread')
export class SpreadSheetController {
    constructor(private readonly service: SpreadSheetService) { }

    @Post('/:userId')
    FindUserDataFromDataBase(@Param('userId') userId: string, @Body() body: QueryParamsDTO) {
        return this.service.FindQueryDataFromServer(body);
    }


}
