export interface IAction<TTypeName, TAction> {
    type: TTypeName,
    data: TAction
}
