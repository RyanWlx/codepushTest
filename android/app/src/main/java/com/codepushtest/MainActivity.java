package com.codepushtest;

import com.facebook.react.ReactActivity;
import com.microsoft.codepush.react.CodePush;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "codepushTest";
    }

    /*@Override
    protected String getJSBundleFile(){
        return CodePush.getBundleUrl():
    }

    @Override
    protected List<ReactPackage> getPackages(){
        //实例化 CodePush运行时，把它添加到 packages,填写正确的 部署秘钥（ deployment key）
        return Arrays.<ReactPackage> as List(
                new MainReactPackage(),
                new CodePush("kU6Puykw6itl7zi8PZQNHGbhss39ac877eb7-7d1b-4b7f-b2f4-44076151ef41" , this , BuildCofig.DEBUG)
        )
    }*/
}
