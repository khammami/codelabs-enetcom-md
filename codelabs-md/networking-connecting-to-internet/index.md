---
id: networking-connecting-to-internet
status: [published]
authors: Khalil Hammami
categories: android
tags: enetcommp,enetcommpie,kiosk,web
source: 12Qc2z9H9IPwCYRbr7u_hQUUKu-mrN4EIo10oK2z67EM
duration: 0

---

# P 02.1: Networking - Connecting to the internet




## GitHub Repo Search Code



The Github Repo Search app searches for a  [GitHub](https://github.com/) repository by name. The URL you'll use to get search information will be something like the URL below, which searches for repositories containing the word android and sorts by the number of stars the repo has:

[https://api.github.com/search/repositories?q=android&sort=stars](https://api.github.com/search/repositories?q=android&sort=stars)

Which returns information in JSON. We'll be going over how to make sense of this returned JSON, parse it and display it in your app during this lesson. We'll also cover how to connect to the internet and download data. Let's get started!

The code for this app can be found in the  [Lesson02-GitHub-Repo-Search](https://github.com/khammami/ud851-Exercises/tree/student/Lesson02-GitHub-Repo-Search) folder of the  [Toy App Repository](https://github.com/khammami/ud851-Exercises).


## Task 1: Create Layout



**Exercise Code:**

<button>[T02.01-Exercise-CreateLayout](https://github.com/khammami/ud851-Exercises/tree/student/Lesson02-GitHub-Repo-Search/T02.01-Exercise-CreateLayout)</button>

**Exercise:**

1. Convert the ConstraintLayout to a LinearLayout
2. Add the EditText for the query
3. Add a TextView to display the URL
4. Add a scrolling TextView (TextView in a ScrollView) to display the query result
5. Create and populate the MainActivity member variables for the Search Box EditText, the URLDisplay TextView, and the SearchResults TextView
6. Remove the unneeded reference to the ConstraintLayout library
7. Migrate to Androidx and update dependencies


## Task 2: Add a menu



**Exercise Code:** 

<button>[T02.02-Exercise-AddMenu](https://github.com/khammami/ud851-Exercises/tree/student/Lesson02-GitHub-Repo-Search/T02.02-Exercise-AddMenu)</button>

**Exercise:**

1. Create the Menu Resource `main.xml`


```
<menu xmlns:android="http://schemas.android.com/apk/res/android"
      xmlns:app="http://schemas.android.com/apk/res-auto">

<!-- TO DO -->

</menu>
```

2. Add the menu item for Search to the Menu Resource, setting it to showAsAction ifRoom

```
<item
        android:id="@+id/action_search"
        android:orderInCategory="1"
        app:showAsAction="ifRoom"
        android:title="@string/search"/>
```

3. Inflate the menu in onCreateOptionsMenu

```
@Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        // Return true to display your menu
        return true;
    }
```

4. Display a toast in onOptionsItemSelected when Search is selected

```
@Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int itemThatWasClickedId = item.getItemId();
        if (itemThatWasClickedId == R.id.action_search) {
            Context context = MainActivity.this;
            String textToShow = "Search clicked";
            Toast.makeText(context, textToShow, Toast.LENGTH_SHORT).show();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
```


## Task 3: Build our URL



Build the Url that will be used to query Github and display it when the Search button is pressed.

**Exercise Code:** 

<button>[T02.03-Exercise-DisplayUrl](https://github.com/khammami/ud851-Exercises/tree/student/Lesson02-GitHub-Repo-Search/T02.03-Exercise-DisplayUrl)</button>

**Exercise:**

1. Fill in the buildUrl method from NetworkUtils using Uri.Builder and the URL constructor

```
public static URL buildUrl(String githubSearchQuery) {
        Uri builtUri = Uri.parse(GITHUB_BASE_URL).buildUpon()
                .appendQueryParameter(PARAM_QUERY, githubSearchQuery)
                .appendQueryParameter(PARAM_SORT, sortBy)
                .build();

        URL url = null;
        try {
            url = new URL(builtUri.toString());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        return url;
    }
```

2. Implement the makeGithubSearchQuery method

```
private void makeGithubSearchQuery() {
        String githubQuery = mSearchBoxEditText.getText().toString();
        URL githubSearchUrl = NetworkUtils.buildUrl(githubQuery);
        mUrlDisplayTextView.setText(githubSearchUrl.toString());
    }
```

3. Call the makeGithubSearchQuery method when Search is selected


## Task 4: Connect to the internet



Follow the TODOS. But it will crash when you run it.

**Exercise Code:** 

<button>[T02.04-Exercise-ConnectingToTheInternet](https://github.com/khammami/ud851-Exercises/tree/student/Lesson02-GitHub-Repo-Search/T02.04-Exercise-ConnectingToTheInternet)</button>

**Exercise:**

1. Add the Internet permission

```
<uses-permission android:name="android.permission.INTERNET" />
```

2. Change the makeGithubSearchQuery to call NetworkUtils.getResponseFromHttpUrl

```
String githubSearchResults = null;
        try {
            githubSearchResults = NetworkUtils.getResponseFromHttpUrl(githubSearchUrl);
            
        } catch (IOException e) {
            e.printStackTrace();
        }
```

3. Set the results in our searchResultsTextView

```
mSearchResultsTextView.setText(githubSearchResults);
```


## Task 5: Create an AsyncTask



### Thread Basics

"When an application component starts and the application does not have any other components running, the Android system starts a new Linux process for the application with a single thread of execution. By default, all components of the same application run in the same process and thread (called the "main" thread). If an application component starts and there already exists a process for that application (because another component from the application exists), then the component is started within that process and uses the same thread of execution. However, you can arrange for different components in your application to run in separate processes, and you can create additional threads for any process."

<video id="fos0rP73LFc"></video>

Check  [Processes and threads overview](https://developer.android.com/guide/components/processes-and-threads) for more details how the processes works.

### AsyncTask

Android `AsyncTask` going to do background operation on background thread and update on main thread. In android we can't directly touch background thread to main thread in android development. asynctask helps us to make communication between background thread to main thread.

**Methods of AsyncTask**

* `onPreExecute()` − Before doing background operation we should show something on screen like progressbar or any animation to the user. We can directly communicate background operations using doInBackground() but for best practice, we should call all asyncTask methods .
* `doInBackground(Params)` − In this method we have to do background operation on the background thread. Operations in this method should not touch on any mainthread activities or fragments.
* `onProgressUpdate(Progress...)` − While doing background operations, if you want to update some information on UI, we can use this method.
* `onPostExecute(Result)` − In this method we can update the ui of background operation result.

**Generic Types in Async Task**

* `TypeOfVarArgParams` − It contains information about what type of params used for execution.
* `ProgressValue` − It contains information about progress units. While doing background operation we can update information on the ui using onProgressUpdate().
* `ResultValue` −It contains information about the result type.

<video id="8CO0UmLZH80"></video>

**Exercise Code:** 

<button>[T02.05-Exercise-CreateAsyncTask](https://github.com/khammami/ud851-Exercises/tree/student/Lesson02-GitHub-Repo-Search/T02.05-Exercise-CreateAsyncTask)</button>

**Exercise:**

1. Create GithubQueryTask as an inner class of MainActivity, with the types URL, Void, and String.

```
public class GithubQueryTask extends AsyncTask<URL, Void, String> {

}
```

2. Override doInBackground to query Github and return a string

```
@Override
        protected String doInBackground(URL... params) {
            URL searchUrl = params[0];
            String githubSearchResults = null;
            try {
                githubSearchResults = NetworkUtils.getResponseFromHttpUrl(searchUrl);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return githubSearchResults;
        }
```

3. Override onPostExecute to set our searchResultsTextView with the GitHub query search results

```
@Override
        protected void onPostExecute(String githubSearchResults) {
            if (githubSearchResults != null && !githubSearchResults.equals("")) {
                mSearchResultsTextView.setText(githubSearchResults);
            }
        }
```

4. Instantiate and call GithubQueryTask in the makeGithubSearchQuery function

```
new GithubQueryTask().execute(githubSearchUrl);
```


## Task 6: Missing Permission



Comment out the 

```
<uses-permission android:name="android.permission.INTERNET" /> 
```

statement in the `AndroidManifest.xml` and then run the app. Make a search in the app, and then look in the **Android Monitor logcat.**

**QUESTION**

In the **Android Monitor logcat**, what error do you see when the app tries to connect to the Internet?


## Task 7: Add Polish



**Exercise Code:** 

<button>[T02.06-Exercise-AddPolish](https://github.com/khammami/ud851-Exercises/tree/student/Lesson02-GitHub-Repo-Search/T02.06-Exercise-AddPolish)</button>

**Exercise:**

1. Add error text string

```
<string name="error_message">
        Failed to get results. Please try again.
    </string>
```

2. Wrap the ScrollView with a FrameLayout

```
<FrameLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">
</FrameLayout>
```

3. Insert an error TextView into the FrameLayout set to our new text string

```
<TextView
            android:id="@+id/tv_error_message_display"
            android:textSize="22sp"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:padding="16dp"
            android:text="@string/error_message"
            android:visibility="invisible" />
```

4. Add helper functions in MainActivity to swap the visibility of JsonData and the ErrorView.

```
private void showJsonDataView() {
        // First, make sure the error is invisible
        mErrorMessageDisplay.setVisibility(View.INVISIBLE);
        // Then, make sure the JSON data is visible
        mSearchResultsTextView.setVisibility(View.VISIBLE);
    }
```

```
private void showErrorMessage() {
        // First, hide the currently visible data
        mSearchResultsTextView.setVisibility(View.INVISIBLE);
        // Then, show the error
        mErrorMessageDisplay.setVisibility(View.VISIBLE);
    }
```

5. Call the error view on null or empty data.
6. Add a progressBar to the FrameLayout

```
<ProgressBar
            android:id="@+id/pb_loading_indicator"
            android:layout_height="42dp"
            android:layout_width="42dp"
            android:layout_gravity="center"
            android:visibility="invisible" />
```

7. Show the progressBar during loading and hide it afterwards


## JSON Format



`JSON` stands for JavaScript Object Notation.It is an independent data exchange format and is the best alternative for `XML`. This chapter explains how to parse the `JSON` file and extract necessary information from it.

Android provides four different classes to manipulate `JSON` data. These classes are  [`JSONArray`](https://developer.android.com/reference/org/json/JSONArray),  [`JSONObject`](https://developer.android.com/reference/org/json/JSONObject),  [`JSONStringer`](https://developer.android.com/reference/org/json/JSONStringer) and  [`JSONTokenizer`](https://developer.android.com/reference/org/json/JSONTokener).

<video id="0IOCgHrTJGU"></video>


## Exercice Sunshine App



1. Networking

**Exercise Code:**

<button>[S02.01-Exercise-Networking](https://github.com/khammami/ud851-Sunshine/tree/student/S02.01-Exercise-Networking)</button>

In this Exercise, you will get to apply what you've learned on Sunshine to add an async task and permissions to load weather data.

1. Fill in buildUrl in NetworkUtils.java
2. Add the Internet Permission
3. Delete the dummy data-related code
4. Create a FetchWeatherTask AsyncTask to perform the network requests
5. Override the doInBackground and onPostExecute methods to get and display the results of the network request
6. Create a loadWeatherData function to get the preferredWeatherLocation from SunshinePreferences and execute the FetchWeatherTask
7. Call loadWeatherData from onCreate

2. Add a menu to Sunshine

**Exercise Code:** 

<button>[S02.02-Exercise-Menus](https://github.com/khammami/ud851-Sunshine/tree/student/S02.02-Exercise-Menus)</button>

Look at your TODOs. This is going to look a lot like what we did to add that menu to the Github query app earlier.

8. Add a "Refresh" string named action_refresh
9. Create a new "forecast" menu with a single "Refresh" menu item
10. Inflate the menu on onCreateOptionsMenu
11. Handle the menu action in onOptionsItemSelected by clearing the weatherTextView and calling loadWeatherData

3. Add Loading Polish and Error Messages to Sunshine

**Exercise Code:** 

<button>[S02.03-Exercise-Polish](https://github.com/khammami/ud851-Sunshine/tree/student/S02.03-Exercise-Polish)</button>

In this Exercise, you will get to apply what you've learned about adding polish to Sunshine.

Add code and views to display an error message for a failed data retrieval, and loading indicators for loading data.

12. Add a string resource for an error message, should loading data fail.
13. Add a TextView that you will show the user if there is an error loading content.
14. Add a ProgressBar to show the user content is loading.
15. In onPostExecute, show the error message, progress bar, or data views as appropriate.
16. Override the method onPreExecute and show the loading indicator.


