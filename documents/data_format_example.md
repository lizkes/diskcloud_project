<!-- Must start with a letter.
only letters,numbers,"_","-".
length is 8-32 bytes -->

username: "^[a-zA-Z]{1}[a-zA-Z0-9_\-]{7,31}$"
<!-- Matches letters, numbers,
and some special characters,
length is 8-64 bytes -->
password: "^[a-zA-Z0-9_!@#$%,\+\-\^\.]{8,32}$"
<!-- If there is space, it is one and only one between every two valid elements
length is 1-255bytes,can only be detected by python-->
dir_name: "^[\w!@#$%,\+\-\^\(\)]{1}([ ]?[\w!@#$%,\+\-\^\(\)])*$"
<!-- js format -->
re = /^[\w\u4e00-\u9fa5!@#$%,\+\-\^\(\)]{1}([ ]?[\w\u4e00-\u9fa5!@#$%,\+\-\^\(\)])*$/;
<!-- If there is space or point, it is one and only one between every two valid elements
length is 1-255bytes,can only be detected by python-->
file_name: "^[\w!@#$%,\+\-\^\(\)]{1}([ ]?[\w!@#$%,.\+\-\^\(\)])*?[\w!@#$%,\+\-\^\(\)]{1}$"
<!-- js format -->
re = /^[\w\u4e00-\u9fa5!@#$%,\+\-\^\(\)]{1}([ ]?[\w\u4e00-\u9fa5!@#$%,.\+\-\^\(\)])*?[\w\u4e00-\u9fa5!@#$%,\+\-\^\(\)]{1}$/;
