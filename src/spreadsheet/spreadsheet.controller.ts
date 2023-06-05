import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { SpreadSheetService } from './spreadsheet.service';
import { QueryParamsDTO } from 'src/dto/queryparam.dto';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('spread')
export class SpreadSheetController {
    constructor(private readonly service: SpreadSheetService) { }

    @UseGuards(AuthGuard)
    @Post('/:userId')
    FindUserDataFromDataBase(@Param('userId') userId: string, @Body() body: QueryParamsDTO) {
        return this.service.FindQueryDataFromServer(body);
    }


}
