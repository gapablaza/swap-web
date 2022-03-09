import { User } from './user.model';

export class Evaluation {
    public creationTime: string; //OK - CON TZ
    public description: string; //OK
    public disableDescription: string | null; //OK
    public disableTime: string | null; //OK - CON TZ
    public disabled: boolean; //OK
    public epochCreationTime: number; //OK
    public epochDisableTime: number | null; //OK
    public evaluationTypeId: number; //OK
    public evaluationTypeName: string; //OK
    public id: number; //OK
    public previousEvaluationsCounter?: number; //OK
    public previousEvaluationsData?: any; //OK - OBJ CON KEYS NUMERICAS
    public user: { //OK
        data: User;
    };

    constructor() {
      this.creationTime = '2022-01-01T00:00:00-00:00';
      this.description = '';
      this.disableDescription = null;
      this.disableTime = null;
      this.disabled = false;
      this.epochCreationTime = 1640995200;
      this.epochDisableTime = null;
      this.evaluationTypeId = 1;
      this.evaluationTypeName = 'Positiva';
      this.id = 0;
      this.user = { data: {} as User };
    }
}
