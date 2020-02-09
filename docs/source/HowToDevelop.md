# How to develop?

### 1.Install global dependencies
``` bash
npm install -g nodemon yarn
npm install -g gitbook-cli  //If you want to update the document
```

### 2.Install project dependencies
``` bash
npm install
```

Because React's project is large, the web page needs to install dependencies separately.

If you want to adjust the page style:
``` bash
cd packages/register-center-webui
yarn
```

### 3.Start development

##### 3.1 Develop Register Center
``` bash
npm run dev:rc
```

##### 3.2 Develop Register Center Web Page
Because the development of the page depends on the registry service, you need to start the registry first when developing the page
``` bash
npm run dev:rc
npm run dev:rcui
```

##### 3.3 Develop Gate
``` bash
npm run dev:gate
```

##### 3.4 Modify document 
``` bash
npm run dev:doc
```

### 4.Construct

*Must be built using CI / CD in principle, Any merge requests that have already been constructed will not be passed*

##### 4.1 Build Register Center
``` bash
npm run build:rc
```

##### 4.2 Build Register Center Web Page
Because building the page alone does not affect the final result, you need to build the page first and then build the registry again
``` bash
npm run build:rcui
npm run build:rc
```

##### 4.3 Build Gate
``` bash
npm run build:gate
```

##### 4.4 Build document 
``` bash
npm run build:doc
```
