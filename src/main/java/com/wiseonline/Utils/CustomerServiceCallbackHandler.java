
/**
 * CustomerServiceCallbackHandler.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis2 version: 1.6.2  Built on : Apr 17, 2012 (05:33:49 IST)
 */

    package com.wiseonline.Utils;

    /**
     *  CustomerServiceCallbackHandler Callback class, Users can extend this class and implement
     *  their own receiveResult and receiveError methods.
     */
    public abstract class CustomerServiceCallbackHandler{



    protected Object clientData;

    /**
    * User can pass in any object that needs to be accessed once the NonBlocking
    * Web service call is finished and appropriate method of this CallBack is called.
    * @param clientData Object mechanism by which the user can pass in user data
    * that will be avilable at the time this callback is called.
    */
    public CustomerServiceCallbackHandler(Object clientData){
        this.clientData = clientData;
    }

    /**
    * Please use this constructor if you don't want to set any clientData
    */
    public CustomerServiceCallbackHandler(){
        this.clientData = null;
    }

    /**
     * Get the client data
     */

     public Object getClientData() {
        return clientData;
     }

        
           /**
            * auto generated Axis2 call back method for getEffectiveAccounts method
            * override this method for handling normal response from getEffectiveAccounts operation
            */
           public void receiveResultgetEffectiveAccounts(
                    com.wiseonline.Utils.CustomerServiceStub.GetEffectiveAccountsResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getEffectiveAccounts operation
           */
            public void receiveErrorgetEffectiveAccounts(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for getBassAssetsById method
            * override this method for handling normal response from getBassAssetsById operation
            */
           public void receiveResultgetBassAssetsById(
                    com.wiseonline.Utils.CustomerServiceStub.GetBassAssetsByIdResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getBassAssetsById operation
           */
            public void receiveErrorgetBassAssetsById(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for getBassAssetsByName method
            * override this method for handling normal response from getBassAssetsByName operation
            */
           public void receiveResultgetBassAssetsByName(
                    com.wiseonline.Utils.CustomerServiceStub.GetBassAssetsByNameResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getBassAssetsByName operation
           */
            public void receiveErrorgetBassAssetsByName(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for getBassAssetsByTime method
            * override this method for handling normal response from getBassAssetsByTime operation
            */
           public void receiveResultgetBassAssetsByTime(
                    com.wiseonline.Utils.CustomerServiceStub.GetBassAssetsByTimeResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getBassAssetsByTime operation
           */
            public void receiveErrorgetBassAssetsByTime(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for getCustomersByTime method
            * override this method for handling normal response from getCustomersByTime operation
            */
           public void receiveResultgetCustomersByTime(
                    com.wiseonline.Utils.CustomerServiceStub.GetCustomersByTimeResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getCustomersByTime operation
           */
            public void receiveErrorgetCustomersByTime(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for getCustomerEventByName method
            * override this method for handling normal response from getCustomerEventByName operation
            */
           public void receiveResultgetCustomerEventByName(
                    com.wiseonline.Utils.CustomerServiceStub.GetCustomerEventByNameResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getCustomerEventByName operation
           */
            public void receiveErrorgetCustomerEventByName(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for getCustomerEventByTime method
            * override this method for handling normal response from getCustomerEventByTime operation
            */
           public void receiveResultgetCustomerEventByTime(
                    com.wiseonline.Utils.CustomerServiceStub.GetCustomerEventByTimeResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getCustomerEventByTime operation
           */
            public void receiveErrorgetCustomerEventByTime(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for getCorpBaseInfoByName method
            * override this method for handling normal response from getCorpBaseInfoByName operation
            */
           public void receiveResultgetCorpBaseInfoByName(
                    com.wiseonline.Utils.CustomerServiceStub.GetCorpBaseInfoByNameResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getCorpBaseInfoByName operation
           */
            public void receiveErrorgetCorpBaseInfoByName(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for getCorpBaseInfoById method
            * override this method for handling normal response from getCorpBaseInfoById operation
            */
           public void receiveResultgetCorpBaseInfoById(
                    com.wiseonline.Utils.CustomerServiceStub.GetCorpBaseInfoByIdResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getCorpBaseInfoById operation
           */
            public void receiveErrorgetCorpBaseInfoById(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for getRoomsByTime method
            * override this method for handling normal response from getRoomsByTime operation
            */
           public void receiveResultgetRoomsByTime(
                    com.wiseonline.Utils.CustomerServiceStub.GetRoomsByTimeResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getRoomsByTime operation
           */
            public void receiveErrorgetRoomsByTime(java.lang.Exception e) {
            }
                
           /**
            * auto generated Axis2 call back method for getCustomerEventById method
            * override this method for handling normal response from getCustomerEventById operation
            */
           public void receiveResultgetCustomerEventById(
                    com.wiseonline.Utils.CustomerServiceStub.GetCustomerEventByIdResponse result
                        ) {
           }

          /**
           * auto generated Axis2 Error handler
           * override this method for handling error response from getCustomerEventById operation
           */
            public void receiveErrorgetCustomerEventById(java.lang.Exception e) {
            }
                


    }
    