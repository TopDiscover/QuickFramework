
/**@description 
 * 数据提交者
 * 绑定view跟model的关系
 * 解耦view跟model  
 * 使用之前需要先用injectPresenter注入提交者
 * 目前未使用，感觉不太好
 */
export interface IPresenter<PresenterType extends Presenter>{
    presenter : PresenterType;
}
export class Presenter {

}
