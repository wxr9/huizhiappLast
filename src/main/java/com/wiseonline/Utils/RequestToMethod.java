package com.wiseonline.Utils;

/**
 * Created by yanwj on 2015/11/6.
 */
public class RequestToMethod
{
    public String controllerName;
    public String methodName;
    public String requestType;
    public String requestUrl;
    public String permissionName;
    public String permissionModule;
    public Class<?>[] methodParmaTypes;

    public RequestToMethod(String requestUrl, String requestType, String controllerName, String requestMethodName,

                           Class<?>[] methodParmaTypes,String permissionName,String permissionModule)
    {
        this.requestUrl = requestUrl;
        this.requestType = requestType;
        this.controllerName = controllerName;
        this.methodName = requestMethodName;
        this.methodParmaTypes = methodParmaTypes;
        this.permissionName = permissionName;
        this.permissionModule = permissionModule;

    }
}
