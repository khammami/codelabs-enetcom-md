# codelabs-enetcom-md

Command claat to export document from gdocs in md file format:

```shell
claat export -f=md -ga="UA-XXXXX" [gdocs_guid]
```

Command to get gdocs source from json file:

```shell
cat codelabs.json | grep "source" | sed 's/.*": //'
```
