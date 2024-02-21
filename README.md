# codelabs-enetcom-md

>[!important]
>
> Use go to install claat to get the latest commits (eg. support of GA v4)

Command claat to export document from gdocs in md file format:

```shell
claat export -f=md -ga="UA-XXXXX" [gdocs_guid]
```

Command to get gdocs source from json file:

```shell
cat codelabs.json | grep "source" | sed 's/.*": "\(.*\)"/\1/'
```
