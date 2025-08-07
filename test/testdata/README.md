Pre-compressed files.

What was used to create them:

```shell
./path/to/dictionary_generator --target_dict_len=50000 txt-dict.bin ./*.txt # create dictionary with compiled tool from brotli research
brotli --stdout -D alice1.txt alice2.txt >> alice2.compressed.dict.br # create version 2 compressed with version 1 as a dictionary
brotli --stdout -9 alice2.txt >> alice2.compressed.9.br # create version 2 compressed with default dictionary
```
