import { User } from './user.model';

export interface Evaluation {
    creationTime: string, //OK - CON TZ
    description: string, //OK
    disableDescription: string | null, //OK
    disableTime: string | null, //OK - CON TZ
    disabled: boolean, //OK
    epochCreationTime: number, //OK
    epochDisableTime: number | null, //OK
    evaluationTypeId: number, //OK
    evaluationTypeName: string, //OK
    id: number, //OK
    previousEvaluationsCounter?: number, //OK
    // previousEvaluationsData?: any, //OK - OBJ CON KEYS NUMERICAS
    previousEvaluationsData?: Evaluation[], //OK - CONVERTIR OBJ A ARRAY
    user: { //OK
        data: User,
    };
}
