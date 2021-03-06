;$(function () {
    var formSubmitType = 1; // 1:新增。 2：更新
    var userTable;
    var userFormBoxObj =  function () {
        var curHtml = '<div id="userFormBox" class="ibox-content">\n' +
            '            <form class="form-horizontal m-t" id="UserForm">\n' +
            '                <input type="hidden" name="uId" id="uId" value="0">\n' +
            '                <div class="form-group">\n' +
            '                    <label class="col-sm-3 control-label">用户账号：</label>\n' +
            '                    <div class="col-sm-7">\n' +
            '                        <input id="uAccount" name="uAccount" type="text" placeholder="请输入用户账号" class="form-control" aria-required="true">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="form-group">\n' +
            '                    <label class="col-sm-3 control-label">常用邮箱：</label>\n' +
            '                    <div class="col-sm-7">\n' +
            '                        <input id="uEmail" name="uEmail" type="email" placeholder="请输入常用邮箱" class="form-control" aria-required="true">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="form-group">\n' +
            '                    <label class="col-sm-3 control-label">昵称：</label>\n' +
            '                    <div class="col-sm-7">\n' +
            '                        <input id="uNickname" name="uNickname" type="text" placeholder="昵称" class="form-control" aria-required="true">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="form-group">\n' +
            '                    <label class="col-sm-3 control-label">用户密码：</label>\n' +
            '                    <div class="col-sm-7">\n' +
            '                        <input id="uPassword" name="uPassword" type="password" placeholder="请输入密码" class="form-control" aria-required="true">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="form-group">\n' +
            '                    <label class="col-sm-3 control-label">电话号码：</label>\n' +
            '                    <div class="col-sm-7">\n' +
            '                        <input id="uPhone" name="uPhone" type="text" placeholder="请输入电话号码" class="form-control" aria-required="false">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </form>\n' +
            '        </div>';

        var curObj = $(curHtml);

        return curObj;
    }();
    window.actionEvents = {
        'click #edit' : function(e, value, row, index) {
            var userId = row.uId;
            //location.href = "view/user/editUI.shtml?userId=" + userId;
            var htmlStr = userFormBoxObj.prop("outerHTML");
            layer.open({
                type: 1,
                title: "编辑用户",
                area: ['85%', '100%'], //宽高
                maxmin: true,
                content:htmlStr,  //注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                success: function (layero, index) {
                    var formBox = $("#userFormBox");
                    addFormValidate(formBox);
                    fullForm(row);
                },
                btn: ['保存', '取消', "重置"],
                yes: function (index, layero) {
                    formSubmitType = 2;
                    $("#UserForm").submit();
                },
                btn2: function (index, layero) {
                    layer.close(index);
                },
                btn3: function (index, layero) {
                    $("#UserForm")[0].reset();
                }
            });
        },
        'click #delete' : function(e, value, row, index) {
            layer.confirm('确定删除该单位？', {
                    btn: ['确定', '取消']
                },
                function(index){
                    layer.close(index);

                    UtilsJS.AjaxRequest({
                        url: 'user/delete.shtml',
                        data:{
                            "uId": row.uId
                        },
                        success:function (data) {
                            layer.msg('删除成功',{
                                time: 1500,
                                icon: 6
                            });
                            setTimeout(function(){
                                layer.closeAll();
                                userListRefresh();
                            },1500);

                        }
                    });
                },
                function(){
                    layer.msg('取消操作');
                }
            );
        },
    };
    var defaultColunms = function () {
        return [
            {title: '用户编号', field: 'uId', align: 'center', valign: 'middle',width:'50px'},
            {title: '用户账号', field: 'uAccount', align: 'center', valign: 'middle', sortable: true},
            {title: '用户昵称', field: 'uNickname', align: 'center', valign: 'middle', sortable: true},
            {title: '用户邮箱', field: 'uEmail', align: 'center', valign: 'middle', sortable: true},
            {title: '用户更新时间', field: 'editTime', align: 'center', valign: 'middle', sortable: true},
            {title: '操作', align: 'center', valign: 'middle', formatter: actionFormatter,events:actionEvents}
        ];
    };

    function actionFormatter(value, row, index) {
        return ['<a class="btn btn-primary btn-xs" id="edit" type="button"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;编辑</a>',
            '&nbsp;&nbsp;',
            '<a class="btn btn-danger btn-xs" id="delete" type="button"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;删除</a>'].join('');
    };

    //填充表单
    function fullForm(data){
        var kUser = data;

        $("#uId").val(kUser.uId);
        $("#uAccount").val(kUser.uAccount);
        $("#uEmail").val(kUser.uEmail);
        $("#uNickname").val(kUser.uNickname);
        $("#uPhone").val(kUser.uPhone);
    };

    $("#addUserBtn").on("click", function () {
        var htmlStr = userFormBoxObj.prop("outerHTML");
        layer.open({
            type: 1,
            title: "添加用户",
            area: ['85%', '100%'], //宽高
            maxmin: true,
            content:htmlStr,  //注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            success: function (layero, index) {
                var formBox = $("#userFormBox");
                addFormValidate(formBox);
            },
            btn: ['保存', '取消'],
            yes: function (index, layero) {
                formSubmitType = 1;
                $("#UserForm").submit();
            },
            btn2: function (index, layero) {
                layer.close(index);
            },
        });
    });

    userTable = new UtilsJS.BSTable("userList", "user/getList.shtml", defaultColunms());
    userTable.init();

    function userListRefresh() {
        userTable.refresh();
    };

    function addFormValidate(obj) {
        var icon = "<i class='fa fa-times-circle'></i> ";
        var $formObj = obj.find("#UserForm");
        $formObj.validate({
            rules: {
                uAccount: {
                    required: true,
                    maxlength: 15
                },
                uEmail: {
                    required: true,
                    maxlength: 50
                },
                uNickname: {
                    required: true,
                    maxlength: 50
                },
                uPassword: {
                    required: true,
                    maxlength:16
                },
                uPhone: {
                    maxlength:13
                }
            },
            messages: {
                uAccount: {
                    required: icon + "请输入用户账号",
                    maxlength: icon + "用户账号不能超过15个字符"
                },
                uEmail: {
                    required: icon + "请输入常用邮箱",
                    maxlength: icon + "常用邮箱不能超过50个字符"
                },
                uNickname: {
                    required: icon + "请输入用户昵称",
                    maxlength: icon + "昵称不能超过50个字符"
                },
                uPassword: {
                    required: icon + "请输入用户密码",
                    maxlength: icon + "用户密码不能超过16个字符"
                },
                uPhone: {
                    maxlength: icon + "电话号码不能超过13个字符"
                }
            },
            submitHandler:function(form){
                if(formSubmitType === 1){   //添加
                    UtilsJS.PostRequeat("user/insert.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                        layer.msg('添加成功',{
                            time: 1500,
                            icon: 6
                        });
                        setTimeout(function(){
                            layer.closeAll();
                            userListRefresh();
                        },1500);
                    });
                }else if(formSubmitType === 2){ //更新
                    UtilsJS.PostRequeat("user/update.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                        layer.msg('更新成功',{
                            time: 1500,
                            icon: 6
                        });
                        setTimeout(function(){
                            layer.closeAll();
                            userListRefresh();
                        },1500);
                    });
                }

            }
        });
    };

    $.validator.setDefaults({
        highlight: function (element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
        },
        success: function (element) {
            element.closest('.form-group').removeClass('has-error').addClass('has-success');
        },
        errorElement: "span",
        errorPlacement: function (error, element) {
            if (element.is(":radio") || element.is(":checkbox")) {
                error.appendTo(element.parent().parent().parent());
            } else {
                error.appendTo(element.parent());
            }
        },
        errorClass: "help-block m-b-none",
        validClass: "help-block m-b-none"
    });
});


function getIdSelections() {
    var $userList = $('#userList');
    return $.map($userList.bootstrapTable('getSelections'), function (row) {
        return row.userId
    });
};

