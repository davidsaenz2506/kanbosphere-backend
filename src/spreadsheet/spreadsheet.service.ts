import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryParamsDTO } from 'src/dto/queryparam.dto';
import { WorkSpace, WorkSpaceDocument } from 'src/models/workspaces.model';

@Injectable()
export class SpreadSheetService {
    constructor(
        @InjectModel(WorkSpace.name)
        private workspaceModel: Model<WorkSpaceDocument>,
    ) { }

    async FindQueryDataFromServer(body: QueryParamsDTO) {
        const currentServerData = await this.workspaceModel.findOne({
            _id: body.workspaceID,
        });
        const filterServerData = currentServerData?.container?.spreadSheetData?.data;

        const filteredDataByQuery = filterServerData?.filter((currentRow) => {
            if (
                Object.values(currentRow).some((currentSubRow) =>
                    currentSubRow.toString().toLowerCase().includes(body.query.toLowerCase()),
                )
            )
                return currentRow;
        });

        return filteredDataByQuery;
    }
}
