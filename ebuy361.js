var T,ebuy361=T= function(){ 
// Copyright (c) 2009-2012, ebuy361 Inc. All rights reserved.
//
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://ebuy361.ebuy361.com/license.html
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


















var T, ebuy361 = T = ebuy361 || function(q, c) { return ebuy361.dom ? ebuy361.dom(q, c) : null; };

ebuy361.version = '2.0.2.5';
ebuy361.guid = "$EBUY$";
ebuy361.key = "ebuy361_guid";

// ebuy361 可能被放在闭包中
// 一些页面级别唯一的属性，需要挂载在 window[ebuy361.guid]上

var _ = window[ ebuy361.guid ] = window[ ebuy361.guid ] || {};
(_.versions || (_.versions = [])).push(ebuy361.version);

// 20120709 mz 添加参数类型检查器，对参数做类型检测保护
ebuy361.check = ebuy361.check || function(){};





ebuy361.merge = function(first, second) {
    var i = first.length,
        j = 0;

    if ( typeof second.length === "number" ) {
        for ( var l = second.length; j < l; j++ ) {
            first[ i++ ] = second[ j ];
        }

    } else {
        while ( second[j] !== undefined ) {
            first[ i++ ] = second[ j++ ];
        }
    }

    first.length = i;

    return first;
};






ebuy361.forEach = function( enumerable, iterator, context ) {
    var i, n, t;

    if ( typeof iterator == "function" && enumerable) {

        // Array or ArrayLike or NodeList or String or ArrayBuffer
        n = typeof enumerable.length == "number" ? enumerable.length : enumerable.byteLength;
        if ( typeof n == "number" ) {

            // 20121030 function.length
            //safari5.1.7 can not use typeof to check nodeList - linlingyu
            if (Object.prototype.toString.call(enumerable) === "[object Function]") {
                return enumerable;
            }

            for ( i=0; i<n; i++ ) {
                
                t = enumerable[ i ]
                t === undefined && (t = enumerable.charAt && enumerable.charAt( i ));

                // 被循环执行的函数，默认会传入三个参数(array[i], i, array)
                iterator.call( context || null, t, i, enumerable );
            }
        
        // enumerable is number
        } else if (typeof enumerable == "number") {

            for (i=0; i<enumerable; i++) {
                iterator.call( context || null, i, i, i);
            }
        
        // enumerable is json
        } else if (typeof enumerable == "object") {

            for (i in enumerable) {
                if ( enumerable.hasOwnProperty(i) ) {
                    iterator.call( context || null, enumerable[ i ], i, enumerable );
                }
            }
        }
    }

    return enumerable;
};






 
ebuy361.lang = ebuy361.lang || {};




ebuy361.type = (function() {
    var objectType = {},
        nodeType = [, "HTMLElement", "Attribute", "Text", , , , , "Comment", "Document", , "DocumentFragment", ],
        str = "Array Boolean Date Error Function Number RegExp String",
        retryType = {'object': 1, 'function': '1'},//解决safari对于childNodes算为function的问题
        toString = objectType.toString;

    // 给 objectType 集合赋值，建立映射
    ebuy361.forEach(str.split(" "), function(name) {
        objectType[ "[object " + name + "]" ] = name.toLowerCase();

        ebuy361[ "is" + name ] = function ( unknow ) {
            return ebuy361.type(unknow) == name.toLowerCase();
        }
    });

    // 方法主体
    return function ( unknow ) {
        var s = typeof unknow;
        return !retryType[s] ? s
            : unknow == null ? "null"
            : unknow._type_
                || objectType[ toString.call( unknow ) ]
                || nodeType[ unknow.nodeType ]
                || ( unknow == unknow.window ? "Window" : "" )
                || "object";
    };
})();

// extend
ebuy361.isDate = function( unknow ) {
    return ebuy361.type(unknow) == "date" && unknow.toString() != 'Invalid Date' && !isNaN(unknow);
};

ebuy361.isElement = function( unknow ) {
    return ebuy361.type(unknow) == "HTMLElement";
};

// 20120818 mz 检查对象是否可被枚举，对象可以是：Array NodeList HTMLCollection $DOM
ebuy361.isEnumerable = function( unknow ){
    return unknow != null
        && (typeof unknow == "object" || ~Object.prototype.toString.call( unknow ).indexOf( "NodeList" ))
    &&(typeof unknow.length == "number"
    || typeof unknow.byteLength == "number"     //ArrayBuffer
    || typeof unknow[0] != "undefined");
};
ebuy361.isNumber = function( unknow ) {
    return ebuy361.type(unknow) == "number" && isFinite( unknow );
};

// 20120903 mz 检查对象是否为一个简单对象 {}
ebuy361.isPlainObject = function(unknow) {
    var key,
        hasOwnProperty = Object.prototype.hasOwnProperty;

    if ( ebuy361.type(unknow) != "object" ) {
        return false;
    }

    //判断new fn()自定义对象的情况
    //constructor不是继承自原型链的
    //并且原型中有isPrototypeOf方法才是Object
    if ( unknow.constructor &&
        !hasOwnProperty.call(unknow, "constructor") &&
        !hasOwnProperty.call(unknow.constructor.prototype, "isPrototypeOf") ) {
        return false;
    }
    //判断有继承的情况
    //如果有一项是继承过来的，那么一定不是字面量Object
    //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
    for ( key in unknow ) {}
    return key === undefined || hasOwnProperty.call( unknow, key );
};

ebuy361.isObject = function( unknow ) {
    return typeof unknow === "function" || ( typeof unknow === "object" && unknow != null );
};











ebuy361.extend = function(depthClone, object) {
    var second, options, key, src, copy,
        i = 1,
        n = arguments.length,
        result = depthClone || {},
        copyIsArray, clone;
    
    ebuy361.isBoolean( depthClone ) && (i = 2) && (result = object || {});
    !ebuy361.isObject( result ) && (result = {});

    for (; i<n; i++) {
        options = arguments[i];
        if( ebuy361.isObject(options) ) {
            for( key in options ) {
                src = result[key];
                copy = options[key];
                // Prevent never-ending loop
                if ( src === copy ) {
                    continue;
                }
                
                if(ebuy361.isBoolean(depthClone) && depthClone && copy
                    && (ebuy361.isPlainObject(copy) || (copyIsArray = ebuy361.isArray(copy)))){
                        if(copyIsArray){
                            copyIsArray = false;
                            clone = src && ebuy361.isArray(src) ? src : [];
                        }else{
                            clone = src && ebuy361.isPlainObject(src) ? src : {};
                        }
                        result[key] = ebuy361.extend(depthClone, clone, copy);
                }else if(copy !== undefined){
                    result[key] = copy;
                }
            }
        }
    }
    return result;
};



ebuy361.createChain = function(chainName, fn, constructor) {
    // 创建一个内部类名
    var className = chainName=="dom"?"$DOM":"$"+chainName.charAt(0).toUpperCase()+chainName.substr(1),
        slice = Array.prototype.slice,
        chain = ebuy361[chainName];
    if(chain){return chain}
    // 构建链头执行方法
    chain = ebuy361[chainName] = fn || function(object) {
        return ebuy361.extend(object, ebuy361[chainName].fn);
    };

    // 扩展 .extend 静态方法，通过本方法给链头对象添加原型方法
    chain.extend = function(extended) {
        var method;

        // 直接构建静态接口方法，如 ebuy361.array.each() 指向到 ebuy361.array().each()
        for (method in extended) {
            (function(method){//解决通过静态方法调用的时候，调用的总是最后一个的问题。
                // 20121128 这个if判断是防止console按鸭子判断规则将本方法识别成数组
                if (method != "splice") {
                    chain[method] = function() {
                        var id = arguments[0];

                        // 在新版接口中，ID选择器必须用 # 开头
                        chainName=="dom" && ebuy361.type(id)=="string" && (id = "#"+ id);

                        var object = chain(id);
                        var result = object[method].apply(object, slice.call(arguments, 1));

                        // 老版接口返回实体对象 getFirst
                        return ebuy361.type(result) == "$DOM" ? result.get(0) : result;
                    }
                }
            })(method);
        }
        return ebuy361.extend(ebuy361[chainName].fn, extended);
    };

    // 创建 链头对象 构造器
    ebuy361[chainName][className] = ebuy361[chainName][className] || constructor || function() {};

    // 给 链头对象 原型链做一个短名映射
    chain.fn = ebuy361[chainName][className].prototype;

    return chain;
};


ebuy361.overwrite = function(Class, list, fn) {
    for (var i = list.length - 1; i > -1; i--) {
        Class.prototype[list[i]] = fn(list[i]);
    }

    return Class;
};




ebuy361.createChain("array", function(array){
    var pro = ebuy361.array.$Array.prototype
        ,ap = Array.prototype
        ,key;

    ebuy361.type( array ) != "array" && ( array = [] );

    for ( key in pro ) {
        //ap[key] || (array[key] = pro[key]);
        array[key] = pro[key];
    }

    return array;
});

// 对系统方法新产生的 array 对象注入自定义方法，支持完美的链式语法
ebuy361.overwrite(ebuy361.array.$Array, "concat slice".split(" "), function(key) {
    return function() {
        return ebuy361.array( Array.prototype[key].apply(this, arguments) );
    }
});






ebuy361.array.extend({
    unique : function (fn) {
        var len = this.length,
            result = this.slice(0),
            i, datum;
            
        if ('function' != typeof fn) {
            fn = function (item1, item2) {
                return item1 === item2;
            };
        }
        
        // 从后往前双重循环比较
        // 如果两个元素相同，删除后一个
        while (--len > 0) {
            datum = result[len];
            i = len;
            while (i--) {
                if (fn(datum, result[i])) {
                    result.splice(len, 1);
                    break;
                }
            }
        }

        len = this.length = result.length;
        for ( i=0; i<len; i++ ) {
            this[ i ] = result[ i ];
        }

        return this;
    }
});



ebuy361.query = ebuy361.query || function(){
    var rId = /^(\w*)#([\w\-\$]+)$/
       ,rId0= /^#([\w\-\$]+)$/
       ,rTag = /^\w+$/
       ,rClass = /^(\w*)\.([\w\-\$]+)$/
       ,rComboClass = /^(\.[\w\-\$]+)+$/
       ,rDivider = /\s*,\s*/
       ,rSpace = /\s+/g
       ,slice = Array.prototype.slice;

    // selector: #id, .className, tagName, *
    function query(selector, context) {
        var t, x, id, dom, tagName, className, arr, list, array = [];

        // tag#id
        if (rId.test(selector)) {
            id = RegExp.$2;
            tagName = RegExp.$1 || "*";

            // 本段代码效率很差，不过极少流程会走到这段
            ebuy361.forEach(context.getElementsByTagName(tagName), function(dom) {
                dom.id == id && array.push(dom);
            });

        // tagName or *
        } else if (rTag.test(selector) || selector == "*") {
            ebuy361.merge(array, context.getElementsByTagName(selector));

        // .className
        } else if (rClass.test(selector)) {
            arr = [];
            tagName = RegExp.$1;
            className = RegExp.$2;
            t = " " + className + " ";
            // bug: className: .a.b

            if (context.getElementsByClassName) {
                arr = context.getElementsByClassName(className);
            } else {
                ebuy361.forEach(context.getElementsByTagName("*"), function(dom) {
                    dom.className && ~(" " + dom.className + " ").indexOf(t) && (arr.push(dom));
                });
            }

            if (tagName && (tagName = tagName.toUpperCase())) {
                ebuy361.forEach(arr, function(dom) {
                    dom.tagName.toUpperCase() === tagName && array.push(dom);
                });
            } else {
                ebuy361.merge(array, arr);
            }
        
        // IE 6 7 8 里组合样式名(.a.b)
        } else if (rComboClass.test(selector)) {
            list = selector.substr(1).split(".");

            ebuy361.forEach(context.getElementsByTagName("*"), function(dom) {
                if (dom.className) {
                    t = " " + dom.className + " ";
                    x = true;

                    ebuy361.forEach(list, function(item){
                        ~t.indexOf(" "+ item +" ") || (x = false);
                    });

                    x && array.push(dom);
                }
            });
        }

        return array;
    }

    // selector 还可以是上述四种情况的组合，以空格分隔
    // @return ArrayLike
    function queryCombo(selector, context) {
        var a, s = selector, id = "__ebuy361__", array = [];

        // 在 #id 且没有 context 时取 getSingle，其它时 getAll
        if (!context && rId0.test(s) && (a=document.getElementById(s.substr(1)))) {
            return [a];
        }

        context = context || document;

        // 用 querySelectorAll 时若取 #id 这种唯一值时会多选
        if (context.querySelectorAll) {
            // 在使用 querySelectorAll 时，若 context 无id将貌似 document 而出错
            if (context.nodeType == 1 && !context.id) {
                context.id = id;
                a = context.querySelectorAll("#" + id + " " + s);
                context.id = "";
            } else {
                a = context.querySelectorAll(s);
            }
            return a;
        } else {
            if (!~s.indexOf(" ")) {
                return query(s, context);
            }

            ebuy361.forEach(query(s.substr(0, s.indexOf(" ")), context), function(dom) { // 递归
                ebuy361.merge(array, queryCombo(s.substr(s.indexOf(" ") + 1), dom));
            });
        }

        return array;
    }

    return function(selector, context, results) {
        if (!selector || typeof selector != "string") {
            return results || [];
        }

        var arr = [];
        selector = selector.replace(rSpace, " ");
        results && ebuy361.merge(arr, results) && (results.length = 0);

        ebuy361.forEach(selector.indexOf(",") > 0 ? selector.split(rDivider) : [selector], function(item) {
            ebuy361.merge(arr, queryCombo(item, context));
        });

        return ebuy361.merge(results || [], ebuy361.array(arr).unique());
    };
}();













ebuy361.createChain("dom",

// method function


function(selector, context) {
    var e, me = new ebuy361.dom.$DOM(context);

    // Handle $(""), $(null), or $(undefined)
    if (!selector) {
        return me;
    }

    // Handle $($DOM)
    if (selector._type_ == "$DOM") {
        return selector;

    // Handle $(DOMElement)
    } else if (selector.nodeType || selector == selector.window) {
        me[0] = selector;
        me.length = 1;
        return me;

    // Handle $(Array) or $(Collection) or $(NodeList)
    } else if (selector.length && me.toString.call(selector) != "[object String]") {
        return ebuy361.merge(me, selector);

    } else if (typeof selector == "string") {
        // HTMLString
        if (selector.charAt(0) == "<" && selector.charAt(selector.length - 1) == ">" && selector.length > 2) {
            // Match a standalone tag
            var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
                doc = context && context._type_ === '$DOM' ? context[0] : context,
                ret = rsingleTag.exec(selector);
            doc = doc && doc.nodeType ? doc.ownerDocument || doc : document;
            ret = ret ? [doc.createElement(ret[1])] : (ebuy361.dom.createElements ? ebuy361.dom.createElements( selector ) : []);
            ebuy361.merge( me, ret);
        // ebuy361.query
        } else {
            ebuy361.query(selector, context, me);
        }
    
    // document.ready
    } else if (typeof selector == "function") {
        return me.ready ? me.ready(selector) : me;
    }

    return me;
},

// constructor
function(context) {
    this.length = 0;
    this._type_ = "$DOM";
    this.context = context || document;
}

).extend({


    
    size: function() {
        return this.length;
    }

    // 2012.11.27 mz 拥有 .length 和 .splice() 方法，console.log() 就认为该对象是 ArrayLike
    ,splice : function(){}

    
    ,get: function(index) {

        if ( typeof index == "number" ) {
            return index < 0 ? this[this.length + index] : this[index];
        }

        return Array.prototype.slice.call(this, 0);
    }

    // 将 $DOM 转换成 Array(dom, dom, ...) 返回
    ,toArray: function(){
        return this.get();
    }

});





ebuy361.dom.extend({
    each : function (iterator) {
        ebuy361.check("function", "ebuy361.dom.each");
        var i, result,
            n = this.length;

        for (i=0; i<n; i++) {
            result = iterator.call( this[i], i, this[i], this );

            if ( result === false || result == "break" ) { break;}
        }

        return this;
    }
});


ebuy361.global = ebuy361.global || (function() {
    var me = ebuy361._global_ = window[ ebuy361.guid ],
        // 20121116 mz 在多个ebuy361同时加载时有互相覆写的风险
        global = me._ = me._ || {};

    return function( key, value, overwrite ) {
        if ( typeof value != "undefined" ) {
            overwrite || ( value = typeof global[ key ] == "undefined" ? value : global[ key ] );
            global[ key ] =  value;

        } else if (key && typeof global[ key ] == "undefined" ) {
            global[ key ] = {};
        }

        return global[ key ];
    }
})();





ebuy361._util_ = ebuy361._util_ || {};



ebuy361._util_.access = function(tang, key, value, callback, pass){
    if(tang.size() <= 0){return tang;}
    switch(ebuy361.type(key)){
        case 'string': //高频
            if(value === undefined){
                return callback.call(tang, tang[0], key);
            }else{
                tang.each(function(index, item){
                    callback.call(tang, item, key,
                        (ebuy361.type(value) === 'function' ? value.call(item, index, callback.call(tang, item, key)) : value),
                        pass);
                });
            }
            break;
        case 'object':
            for(var i in key){
                ebuy361._util_.access(tang, i, key[i], callback, value);
            }
            break;
    }
    return tang;
};

ebuy361._util_.nodeName = function(ele, nodeName){
    return ele.nodeName && ele.nodeName.toLowerCase() === nodeName.toLowerCase();
};

ebuy361._util_.propFixer = {
    tabindex: 'tabIndex',
    readonly: 'readOnly',
    'for': 'htmlFor',
    'class': 'className',
    'classname': 'className',
    maxlength: 'maxLength',
    cellspacing: 'cellSpacing',
    cellpadding: 'cellPadding',
    rowspan: 'rowSpan',
    colspan: 'colSpan',
    usemap: 'useMap',
    frameborder: 'frameBorder',
    contenteditable: 'contentEditable',
    
    
    //rboolean在ebuy361._util_.removeAttr 和 ebuy361._util_.attr中需要被共同使用
    rboolean: /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i
};
// IE6/7 call enctype encoding
!document.createElement('form').enctype
    && (ebuy361._util_.propFixer.enctype = 'encoding');
//Sizzle.isXML

ebuy361._util_.isXML = function(ele) {
    var docElem = (ele ? ele.ownerDocument || ele : 0).documentElement;
    return docElem ? docElem.nodeName !== 'HTML' : false;
};
ebuy361._util_.prop = function(){
    var rfocusable = /^(?:button|input|object|select|textarea)$/i,
        rclickable = /^a(?:rea|)$/i,
        select = document.createElement('select'),
        opt = select.appendChild(document.createElement('option')),
        propHooks = {
            tabIndex: {
                get: function(ele){
                    var attrNode = ele.getAttributeNode('tabindex');
                    return attrNode && attrNode.specified ? parseInt(attrNode.value, 10)
                        : rfocusable.test(ele.nodeName) || rclickable.test(ele.nodeName)
                            && ele.href ? 0 : undefined;
                }
            }
        };
        !opt.selected && (propHooks.selected = {
            get: function(ele){
                var par = ele.parentNode;
                if(par){
                    par.selectedIndex;
                    par.parentNode && par.parentNode.selectedIndex;
                }
                return null;
            }
        });
        select = opt = null;
    
    return function(ele, key, val){
        var nType = ele.nodeType,
            hooks, ret;
        if(!ele || ~'238'.indexOf(nType)){return;}
        if(nType !== 1 || !ebuy361._util_.isXML(ele)){
            key = ebuy361._util_.propFixer[key] || key;
            hooks = propHooks[key] || {};
        }
        if(val !== undefined){
            if(hooks.set && (ret = hooks.set(ele, key, val)) !== undefined){
                return ret;
            }else{
                return (ele[key] = val);
            }
        }else{
            if(hooks.get && (ret = hooks.get(ele, key)) !== null){
                return ret;
            }else{
                return ele[key];
            }
        }
    }
}();


ebuy361._util_.support = ebuy361._util_.support || function(){
    var div = document.createElement('div'),
        baseSupport, a, input, select, opt;
    div.setAttribute('className', 't');
    div.innerHTML = ' <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
    a = div.getElementsByTagName('A')[0];
    a.style.cssText = 'top:1px;float:left;opacity:.5';
    select = document.createElement('select');
    opt = select.appendChild(document.createElement('option'));
    input = div.getElementsByTagName('input')[0];
    input.checked = true;
    
    baseSupport = {
        dom: {
            div: div,
            a: a,
            select: select,
            opt: opt,
            input: input
        }
//        radioValue: only import by ebuy361._util.attr
//        hrefNormalized: only import by ebuy361._util.attr
//        style: only import by ebuy361._util.attr
//        optDisabled: only import by ebuy361.dom.val
//        checkOn: only import by ebuy361.dom.val
//        noCloneEvent: only import by ebuy361.dom.clone
//        noCloneChecked: only import by ebuy361.dom.clone
//        cssFloat: only import ebuy361.dom.styleFixer
//        htmlSerialize: only import ebuy361.dom.html
//        leadingWhitespace: only import ebuy361.dom.html
    };
    return baseSupport;
}();
ebuy361._util_.support.getSetAttribute = ebuy361._util_.support.dom.div.className !== 't';
ebuy361._util_.nodeHook = function(){
    if(ebuy361._util_.support.getSetAttribute){return;}
    var fixSpecified = {};
    fixSpecified.name = fixSpecified.id = fixSpecified.coords = true;
    return {
        get: function(ele, key){
            var ret = ele.getAttributeNode(key);
            return ret && (fixSpecified[key] ? ret.value !== '' : ret.specified) ?
                 ret.value : undefined;
        },
        set: function(ele, key, val){
            // Set the existing or create a new attribute node
            var ret = ele.getAttributeNode(key);
            if(!ret){
                ret = document.createAttribute(key);
                ele.setAttributeNode(ret);
            }
            return (ret.value = val + '');
        }
    };
}();





ebuy361._util_.removeAttr = function(){
    var propFixer = ebuy361._util_.propFixer,
        core_rspace = /\s+/,
        getSetAttribute = ebuy361._util_.support.getSetAttribute;
    return function(ele, key){
        if(!key || ele.nodeType !==1){return;}
        var array = key.split(core_rspace),
            propName, isBool;
        for(var i = 0, attrName; attrName = array[i]; i++){
            propName = propFixer[attrName] || attrName;
            isBool = propFixer.rboolean.test(attrName);
            !isBool && ebuy361._util_.attr(ele, attrName, '');
            ele.removeAttribute(getSetAttribute ? attrName : propName);
            isBool && (propName in ele) && (ele[propName] = false);
        }
    }
}();

ebuy361._util_.contains = document.compareDocumentPosition ?
    function(container, contained){
        return !!(container.compareDocumentPosition( contained ) & 16);
    } : function(container, contained){
        if(container === contained){return false;}
        if(container.contains && contained.contains){
            return container.contains(contained);
        }else{
            while(contained = contained.parentNode){
                if(contained === container){return true;}
            }
            return false;
        }
    };

ebuy361._util_.attr = function(){
    var util = ebuy361._util_,
        rtype = /^(?:button|input)$/i,
        supportDom = util.support.dom,
        radioValue = supportDom.input.value === 't',
        hrefNormalized = supportDom.a.getAttribute('href') === '/a',
        style = /top/.test(supportDom.a.getAttribute('style')),
        nodeHook = util.nodeHook,
        attrFixer = {
            className: 'class'
        },
        boolHook = {//处理对属性值是布尔值的情况
            get: function(ele, key){
                var val = util.prop(ele, key), attrNode;
                return val === true || typeof val !== 'boolean'
                    && (attrNode = ele.getAttributeNode(key))
                    && attrNode.nodeValue !== false ? key.toLowerCase() : undefined;
            },
            set: function(ele, key, val){
                if(val === false){
                    util.removeAttr(ele, key);
                }else{
                    var propName = util.propFixer[key] || key;
                    (propName in ele) && (ele[propName] = true);
                    ele.setAttribute(key, key.toLowerCase());
                }
                return key;
            }
        },
        attrHooks = {
            type: {
                set: function(ele, key, val){
                    // We can't allow the type property to be changed (since it causes problems in IE)
//                    if(rtype.test(ele.nodeName) && util.contains(document.body, ele)){return val;};
                    if(rtype.test(ele.nodeName) && ele.parentNode){return val;};
                    if(!radioValue && val === 'radio' && util.nodeName(ele, 'input')){
                        var v = ele.value;
                        ele.setAttribute('type', val);
                        v && (ele.value = v);
                        return val;
                    };
                }
            },
            value: {
                get: function(ele, key){
                    if(nodeHook && util.nodeName(ele, 'button')){
                        return nodeHook.get(ele, key);
                    }
                    return key in ele ? ele.value : null;
                },
                set: function(ele, key, val){
                    if(nodeHook && util.nodeName(ele, 'button')){
                        return nodeHook.set(ele, key, val);
                    }
                    ele.value = val;
                }
            }
        };
    // Set width and height to auto instead of 0 on empty string
    // This is for removals
    if(!util.support.getSetAttribute){//
        ebuy361.forEach(['width', 'height'], function(item){
            attrHooks[item] = {
                set: function(ele, key, val){
                    if(val === ''){
                        ele.setAttribute(key, 'auto');
                        return val;
                    }
                }
            };
        });
        attrHooks.contenteditable = {
            get: nodeHook.get,
            set: function(ele, key, val){
                val === '' && (val = false);
                nodeHook.set(ele, key, val);
            }
        };
    }
    // Some attributes require a special call on IE
    if(!hrefNormalized){
        ebuy361.forEach(['href', 'src', 'width', 'height'], function(item){
            attrHooks[item] = {
                get: function(ele, key){
                    var ret = ele.getAttribute(key, 2);
                    return ret === null ? undefined : ret;
                }
            };
        });
    }
    if(!style){
        attrHooks.style = {
            get: function(ele){return ele.style.cssText.toLowerCase() || undefined;},
            set: function(ele, key, val){return (ele.style.cssText = val + '');}
        };
    }
    //attr
    return function(ele, key, val, pass){
        var nType = ele.nodeType,
            notxml = nType !== 1 || !util.isXML(ele),
            hooks, ret;
        if(!ele || ~'238'.indexOf(nType)){return;}
        if(pass && ebuy361.dom.fn[key]){
            return ebuy361.dom(ele)[key](val);
        }
        //if getAttribute is undefined, use prop interface
        if(notxml){
            key = attrFixer[key] || key.toLowerCase();
            hooks = attrHooks[key] || (util.propFixer.rboolean.test(key) ? boolHook : nodeHook);
        }
        if(val!== undefined){
            if(val === null){
                util.removeAttr(ele, key);
                return
            }else if(notxml && hooks && hooks.set && (ret = hooks.set(ele, key, val)) !== undefined){
                return ret;
            }else{
                ele.setAttribute(key, val + '');
                return val;
            }
        }else if(notxml && hooks && hooks.get && (ret = hooks.get(ele, key)) !== null){
            return ret;
        }else{
            ret = ele.getAttribute(key);
            return ret === null ? undefined : ret;
        }
   }
}();
ebuy361.dom.extend({
    attr: function(key, value){
        return ebuy361._util_.access(this, key, value, function(ele, key, val, pass){
            return ebuy361._util_.attr(ele, key, val, pass);
        });
    }
});

ebuy361.dom.extend({
    removeAttr: function(key){
        this.each(function(index, item){
            ebuy361._util_.removeAttr(item, key);
        });
        return this;
    }
});


ebuy361.dom.extend({
    prop: function(propName, value){
        return ebuy361._util_.access(this, propName, value, function(ele, key, val){
            return ebuy361._util_.prop(ele, key, val);
        });
    }
});

ebuy361.dom.extend({
    removeProp: function(key){
        key = ebuy361._util_.propFixer[key] || key;
        this.each(function(index, item){
            // try/catch handles cases where IE balks (such as removing a property on window)
            try{
                item[key] = undefined;
                delete item[key];
            }catch(e){}
        });
        return this;
    }
});







ebuy361.browser = ebuy361.browser || function(){
    var ua = navigator.userAgent;
    
    var result = {
        isStrict : document.compatMode == "CSS1Compat"
        ,isGecko : /gecko/i.test(ua) && !/like gecko/i.test(ua)
        ,isWebkit: /webkit/i.test(ua)
    };

    try{/(\d+\.\d+)/.test(external.max_version) && (result.maxthon = + RegExp['\x241'])} catch (e){};

    // 蛋疼 你懂的
    switch (true) {
        case /msie (\d+\.\d+)/i.test(ua) :
            result.ie = document.documentMode || + RegExp['\x241'];
            break;
        case /chrome\/(\d+\.\d+)/i.test(ua) :
            result.chrome = + RegExp['\x241'];
            break;
        case /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) :
            result.safari = + (RegExp['\x241'] || RegExp['\x242']);
            break;
        case /firefox\/(\d+\.\d+)/i.test(ua) : 
            result.firefox = + RegExp['\x241'];
            break;
        
        case /opera(?:\/| )(\d+(?:\.\d+)?)(.+?(version\/(\d+(?:\.\d+)?)))?/i.test(ua) :
            result.opera = + ( RegExp["\x244"] || RegExp["\x241"] );
            break;
    }
           
    ebuy361.extend(ebuy361, result);

    return result;
}();



ebuy361.id = function() {
    var maps = ebuy361.global("_maps_id")
        ,key = ebuy361.key;

    // 2012.12.21 与老版本同步
    window[ ebuy361.guid ]._counter = window[ ebuy361.guid ]._counter || 1;

    return function( object, command ) {
        var e
            ,str_1= ebuy361.isString( object )
            ,obj_1= ebuy361.isObject( object )
            ,id = obj_1 ? object[ key ] : str_1 ? object : "";

        // 第二个参数为 String
        if ( ebuy361.isString( command ) ) {
            switch ( command ) {
            case "get" :
                return obj_1 ? id : maps[id];
//            break;
            case "remove" :
            case "delete" :
                if ( e = maps[id] ) {
                    // 20120827 mz IE低版本(ie6,7)给 element[key] 赋值时会写入DOM树，因此在移除的时候需要使用remove
                    if (ebuy361.isElement(e) && ebuy361.browser.ie < 8) {
                        e.removeAttribute(key);
                    } else {
                        delete e[ key ];
                    }
                    delete maps[ id ];
                }
                return id;
//            break;
            default :
                if ( str_1 ) {
                    (e = maps[ id ]) && delete maps[ id ];
                    e && ( maps[ e[ key ] = command ] = e );
                } else if ( obj_1 ) {
                    id && delete maps[ id ];
                    maps[ object[ key ] = command ] = object;
                }
                return command;
            }
        }

        // 第一个参数不为空
        if ( obj_1 ) {
            !id && (maps[ object[ key ] = id = ebuy361.id() ] = object);
            return id;
        } else if ( str_1 ) {
            return maps[ object ];
        }

        return "ebuy361_" + ebuy361._global_._counter ++;
    };
}();

//TODO: mz 20120827 在低版本IE做delete操作时直接 delete e[key] 可能出错，这里需要重新评估，重写










 
ebuy361.dom.extend({
    data : function () {
        var   guid = ebuy361.key
            , maps = ebuy361.global("_maps_HTMLElementData");

        return function( key, value ) {
            ebuy361.forEach( this, function( dom ) {
                !dom[ guid ] && ( dom[ guid ] = ebuy361.id() );
            });

            if ( ebuy361.isString(key) ) {

                // get first
                if ( typeof value == "undefined" ) {
                    var data,result;
                    result = this[0] && (data = maps[ this[0][guid] ]) && data[ key ];
                    if(typeof result != 'undefined'){
                        return result;
                    }else{

                        //取得自定义属性
                        var attr = this[0].getAttribute('data-'+key);
                        return !~String(attr).indexOf('{') ? attr:Function("return "+attr)();
                    }
                }

                // set all
                ebuy361.forEach(this, function(dom){
                    var data = maps[ dom[ guid ] ] = maps[ dom[ guid ] ] || {};
                    data[ key ] = value;
                });
            
            // json
            } else if ( ebuy361.type(key) == "object") {

                // set all
                ebuy361.forEach(this, function(dom){
                    var data = maps[ dom[ guid ] ] = maps[ dom[ guid ] ] || {};

                    ebuy361.forEach( key , function(item,index) {
                        data[ index ] = key[ index ];
                    });
                });
            }

            return this;
        }
    }()
});









ebuy361.dom.extend({
    removeData : function () {
        var   guid = ebuy361.key
            , maps = ebuy361.global("_maps_HTMLElementData");

        return function( key ) {
            ebuy361.forEach( this, function( dom ) {
                !dom[ guid ] && ( dom[ guid ] = ebuy361.id() );
            });

            // set all
            ebuy361.forEach(this, function(dom){
                var map = maps[dom[ guid ]];

                if (typeof key == "string") {
                    map && delete map[ key ];

                } else if (ebuy361.type( key) == "array") {
                    ebuy361.forEach( key, function(i) {
                        map && delete map[ i ];
                    });
                }
            });

            return this;
        }
    }()
});








ebuy361.createChain('string',
    // 执行方法
    function(string){
        var type = ebuy361.type(string),
            str = new String(~'string|number'.indexOf(type) ? string : type),
            pro = String.prototype;
        ebuy361.forEach(ebuy361.string.$String.prototype, function(fn, key) {
            pro[key] || (str[key] = fn);
        });
        return str;
    }
);





ebuy361.string.extend({
    trim: function(){
        var trimer = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g');
        return function(){
            return this.replace(trimer, '');
        }
    }()
});

ebuy361.dom.extend({
    addClass: function( value ){

        if( !arguments.length )
            return this;

        var t = typeof value, b = " ";

        if( t == "string" ){
            value = ebuy361.string.trim(value);
            
            var arr = value.split(" ");

            ebuy361.forEach( this, function(item, index){
                var str = item.className;
                
                for(var i = 0; i < arr.length; i ++)
                    if(!~(b + str + b).indexOf(b + arr[i] + b))
                        str += " " + arr[i];
                
                item.className = str.replace(/^\s+/g, "");
            } );
        }else if( t == "function" )
            ebuy361.forEach(this, function(item, index){
                ebuy361.dom(item).addClass(value.call(item, index, item.className));
            });

        return this;
    }
});



ebuy361.dom.extend({
    removeClass: function(value){

        var type = typeof value, b = " ";

        if( !arguments.length )
            ebuy361.forEach(this, function(item){
                item.className = "";
            });

        if( type == "string" ){
            value = ebuy361.string.trim(value);
            var arr = value.split(" ");

            ebuy361.forEach(this, function(item){
                var str = item.className ;
                for(var i = 0; i < arr.length; i ++)
                    while(~(b + str + b).indexOf(b + arr[i] + b))
                       str = (b + str + b).replace(b + arr[i] + b, b);
                item.className = ebuy361.string.trim(str);
            });

        }else if(type == "function"){
            ebuy361.forEach(this, function(item, index ,className){
                ebuy361.dom(item).removeClass(value.call(item, index, item.className));
            }); 
        }

        return this;
    }
});




ebuy361.dom.extend({

    pushStack : function ( elems ) {
        var ret = ebuy361.dom();

        ebuy361.merge(ret, elems);

        ret.prevObject = this;
        ret.context = this.context;

        return ret;
    }
});




ebuy361.dom.extend({
    eq : function (index) {
        ebuy361.check("number","ebuy361.dom.eq");
        var item = this.get( index );
        return this.pushStack( typeof item === "undefined" ? []: [item] );
    }
});




ebuy361.dom.extend({
    getComputedStyle: function(key){
        if(!this[0].ownerDocument){return;}// document can not get style;
        var defaultView = this[0].ownerDocument.defaultView,
            computedStyle = defaultView && defaultView.getComputedStyle
                && defaultView.getComputedStyle(this[0], null),
            val = computedStyle ? (computedStyle.getPropertyValue(key) || computedStyle[key]) : '';
        return val || this[0].style[key];
    }
});


ebuy361.dom.extend({
    getCurrentStyle: function(){
        var css = document.documentElement.currentStyle ?
            function(key){return this[0].currentStyle ? this[0].currentStyle[key] : this[0].style[key];}
                : function(key){return this.getComputedStyle(key);}
        return function(key){
            return css.call(this, key);
        }
    }()
});





ebuy361.each = function( enumerable, iterator, context ) {
    var i, n, t, result;

    if ( typeof iterator == "function" && enumerable) {

        // Array or ArrayLike or NodeList or String or ArrayBuffer
        n = typeof enumerable.length == "number" ? enumerable.length : enumerable.byteLength;
        if ( typeof n == "number" ) {

            // 20121030 function.length
            //safari5.1.7 can not use typeof to check nodeList - linlingyu
            if (Object.prototype.toString.call(enumerable) === "[object Function]") {
                return enumerable;
            }

            for ( i=0; i<n; i++ ) {
                //enumerable[ i ] 有可能会是0
                t = enumerable[ i ];
                t === undefined && (t = enumerable.charAt && enumerable.charAt( i ));
                // 被循环执行的函数，默认会传入三个参数(i, array[i], array)
                result = iterator.call( context || t, i, t, enumerable );

                // 被循环执行的函数的返回值若为 false 和"break"时可以影响each方法的流程
                if ( result === false || result == "break" ) {break;}
            }
        
        // enumerable is number
        } else if (typeof enumerable == "number") {

            for (i=0; i<enumerable; i++) {
                result = iterator.call( context || i, i, i, i);
                if ( result === false || result == "break" ) { break;}
            }
        
        // enumerable is json
        } else if (typeof enumerable == "object") {

            for (i in enumerable) {
                if ( enumerable.hasOwnProperty(i) ) {
                    result = iterator.call( context || enumerable[ i ], i, enumerable[ i ], enumerable );

                    if ( result === false || result == "break" ) { break;}
                }
            }
        }
    }

    return enumerable;
};





ebuy361._util_.getWidthOrHeight = function(){
    var ret = {},
        cssShow = {position: 'absolute', visibility: 'hidden', display: 'block'},
        rdisplayswap = /^(none|table(?!-c[ea]).+)/;
    function swap(ele, options){
        var defaultVal = {};
        for(var i in options){
            defaultVal[i] = ele.style[i];
            ele.style[i] = options[i];
        }
        return defaultVal;
    }
    ebuy361.forEach(['Width', 'Height'], function(item){
        var cssExpand = {Width: ['Right', 'Left'], Height: ['Top', 'Bottom']}[item];
        ret['get' + item] = function(ele, extra){
            var tang = ebuy361.dom(ele),
                defaultValue = ele.offsetWidth === 0
                    && rdisplayswap.test(tang.getCurrentStyle('display'))
                    && (swap(ele, cssShow)),
                rect = ele['offset' + item] || parseInt(tang.getCurrentStyle(item.toLowerCase())) || 0,
                delString = 'padding|border';
            extra && ebuy361.forEach(extra.split('|'), function(val){
                if(!~delString.indexOf(val)){//if val is margin
                    rect += parseFloat(tang.getCurrentStyle(val + cssExpand[0])) || 0;
                    rect += parseFloat(tang.getCurrentStyle(val + cssExpand[1])) || 0;
                }else{//val is border or padding
                    delString = delString.replace(new RegExp('\\|?' + val + '\\|?'), '');
                }
            });
            delString && ebuy361.forEach(delString.split('|'), function(val){
                rect -= parseFloat(tang.getCurrentStyle(val + cssExpand[0] + (val === 'border' ? 'Width' : ''))) || 0;
                rect -= parseFloat(tang.getCurrentStyle(val + cssExpand[1] + (val === 'border' ? 'Width' : ''))) || 0;
            });
            defaultValue && swap(ele, defaultValue);
            return rect;
        }
    });
    //
    return function(ele, key, extra){
        return ret[key === 'width' ? 'getWidth' : 'getHeight'](ele, extra);
    }
}();


ebuy361._util_.setPositiveNumber = function(){
    var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        rnumsplit = new RegExp('^(' + core_pnum + ')(.*)$', 'i');
    return function(ele, val, subtract){
        var mc = rnumsplit.exec(val);
        return mc ?
            Math.max(0, mc[1] - (subtract || 0)) + (mc[2] || 'px') : val;
    };
}();

ebuy361._util_.style = ebuy361.extend({
    set: function(ele, key, val){ele.style[key] = val;}
}, document.documentElement.currentStyle? {
    get: function(ele, key){
        var val = ebuy361.dom(ele).getCurrentStyle(key),
            defaultLeft;
        if(/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i.test(val)){
            defaultLeft = ele.style.left;
            ele.style.left = key === 'fontSize' ? '1em' : val;
            val = ele.style.pixelLeft + 'px';
            ele.style.left = defaultLeft;
        }
        return val;
    }
} : {
    get: function(ele, key){
        return ebuy361.dom(ele).getCurrentStyle(key);
    }
});

ebuy361._util_.cssHooks = function(){
    var alpha = /alpha\s*\(\s*opacity\s*=\s*([^)]*)/i,
        style = ebuy361._util_.style,
//        nonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
        anchor = ebuy361._util_.support.dom.a,
        cssMapping = {
            fontWeight: {normal: 400, bold: 700, bolder: 700, lighter: 100}
        },
        cssHooks = {
            opacity: {},
            width: {},
            height: {},
            fontWeight: {
                get: function(ele, key){
                    var ret = style.get(ele, key);
                    return cssMapping.fontWeight[ret] || ret;
                }
            }
        };
    //
    function setValue(ele, key, val){
        ebuy361.type(val) === 'string' && (val = ebuy361._util_.setPositiveNumber(ele, val));
        style.set(ele, key, val);
    }
    //
    ebuy361.extend(cssHooks.opacity, /^0.5/.test(anchor.style.opacity) ? {
        get: function(ele, key){
            var ret = ebuy361.dom(ele).getCurrentStyle(key);
            return ret === '' ? '1' : ret;
        }
    } : {
        get: function(ele){
            return alpha.test((ele.currentStyle || ele.style).filter || '') ? (parseFloat(RegExp.$1) / 100) + '' : '1';
        },
        set: function(ele, key, value){
            var filterString = (ele.currentStyle || ele.style).filter || '',
                opacityValue = value * 100;
                ele.style.zoom = 1;
                ele.style.filter = alpha.test(filterString) ? filterString.replace(alpha, 'Alpha(opacity=' + opacityValue)
                    : filterString + ' progid:dximagetransform.microsoft.Alpha(opacity='+ opacityValue +')';
        }
    });
    //
    ebuy361.forEach(['width', 'height'], function(item){
        cssHooks[item] = {
            get: function(ele){
                return ebuy361._util_.getWidthOrHeight(ele, item) + 'px';
            },
            set: setValue
        };
    });

    ebuy361.each({
        padding: "",
        border: "Width"
    }, function( prefix, suffix ) {
        cssHooks[prefix + suffix] = {set: setValue};
        var cssExpand = [ "Top", "Right", "Bottom", "Left" ],
            i=0;
        for ( ; i < 4; i++ ) {
            cssHooks[ prefix + cssExpand[ i ] + suffix ] = {
                set: setValue
            };
        }
    });
    return cssHooks;
}();

ebuy361._util_.cssNumber = {
    'columnCount': true,
    'fillOpacity': true,
    'fontWeight': true,
    'lineHeight': true,
    'opacity': true,
    'orphans': true,
    'widows': true,
    'zIndex': true,
    'zoom': true
};







 //支持单词以“-_”分隔
 //todo:考虑以后去掉下划线支持？
ebuy361.string.extend({
    toCamelCase : function () {
        var source = this.valueOf();
        //提前判断，提高getStyle等的效率 thanks xianwei
        if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
            return source;
        }
        return source.replace(/[-_][^-_]/g, function (match) {
            return match.charAt(1).toUpperCase();
        });
    }
});


ebuy361.dom.styleFixer = function(){
    var style = ebuy361._util_.style,
        cssHooks = ebuy361._util_.cssHooks,
        cssNumber = ebuy361._util_.cssNumber,
        cssProps = {
            'float': !!ebuy361._util_.support.dom.a.style.cssFloat ? 'cssFloat' : 'styleFloat'
        };
    return function(ele, key, val){
        var origKey = ebuy361.string.toCamelCase(key),
            method = val === undefined ? 'get' : 'set',
            origVal, hooks;
        origKey = cssProps[origKey] || origKey;
        origVal = ebuy361.type(val) === 'number' && !cssNumber[origKey] ? val + 'px' : val;
        hooks = cssHooks.hasOwnProperty(origKey) && cssHooks[origKey][method] || style[method];
        return hooks(ele, origKey, origVal);
    }
}();









ebuy361.dom.extend({
    css: function(key, value){
        ebuy361.check('^(?:(?:string(?:,(?:number|string|function))?)|object)$', 'ebuy361.dom.css');
        return ebuy361._util_.access(this, key, value, function(ele, key, val){
            var styleFixer = ebuy361.dom.styleFixer;
            return styleFixer ? styleFixer(ele, key, val)
                : (val === undefined ? this.getCurrentStyle(key) : ele.style[key] = val);
        });
    }
});




ebuy361.dom.extend({
    getDocument: function(){
        if(this.size()<=0){return undefined;}
        var ele = this[0];
        return ele.nodeType == 9 ? ele : ele.ownerDocument || ele.document;
    }
});





ebuy361._util_.getDefaultDisplayValue = function(){
    var valMap = {};
    return function(tagName){
        if(valMap[tagName]){return valMap[tagName];}
        var ele = document.createElement(tagName),
            val, frame, ownDoc;
        document.body.appendChild(ele);
        val = ebuy361.dom(ele).getCurrentStyle('display');
        document.body.removeChild(ele);
        if(val === '' || val === 'none'){
            frame = document.body.appendChild(document.createElement('iframe'));
            frame.frameBorder =
            frame.width =
            frame.height = 0;
            ownDoc = (frame.contentWindow || frame.contentDocument).document;
            ownDoc.writeln('<!DOCTYPE html><html><body>');
            ownDoc.close();
            ele = ownDoc.appendChild(ownDoc.createElement(tagName));
            val = ebuy361.dom(ele).getCurrentStyle('display');
            document.body.removeChild(frame);
            frame = null;
        }
        ele = null;
        return valMap[tagName] = val;
    }
}();




ebuy361._util_.isHidden = function(ele){
    return ebuy361.dom(ele).getCurrentStyle('display') === 'none'
        || !ebuy361._util_.contains(ele.ownerDocument, ele);
}



ebuy361.dom.extend({
    show: function(){
        var vals = [],
            display, tang;
        this.each(function(index, ele){
            if(!ele.style){return;}
            tang = ebuy361.dom(ele);
            display = ele.style.display;
            vals[index] = tang.data('olddisplay');
            if(!vals[index] && display === 'none'){
                ele.style.display = '';
            }
            if(ele.style.display === ''
                && ebuy361._util_.isHidden(ele)){
                    tang.data('olddisplay', (vals[index] = ebuy361._util_.getDefaultDisplayValue(ele.nodeName)));
            }
        });
        
        return this.each(function(index, ele){
            if(!ele.style){return;}
            if(ele.style.display === 'none'
                || ele.style.display === ''){
                    ele.style.display = vals[index] || '';
            }
        });
    }
});






ebuy361.dom.extend({
    hide: function(){
        var vals = [],
            tang, isHidden, display;
        return this.each(function(index, ele){
            if(!ele.style){return;}//当前的这个不做操作
            tang = ebuy361(ele);
            vals[index] = tang.data('olddisplay');
            display = ele.style.display;
            if(!vals[index]){
                isHidden = ebuy361._util_.isHidden(ele);
                if(display && display !== 'none' || !isHidden){
                    tang.data('olddisplay', isHidden ? display : tang.getCurrentStyle('display'));
                }
            }
            ele.style.display = 'none';
        });
    }
});



ebuy361.dom.extend({
    toggle: function(){
        for(var i = 0 , num = this.size(); i < num ; i++ ){
            var ele = this.eq(i);
            if(ele.css('display') != 'none'){
                ele.hide();
            }else{
                ele.show();
            };
        };
    }
});

/// support magic - ebuy361 1.x Code Start






ebuy361.dom.g = function(id) {
    if (!id) return null; //修改IE下ebuy361.dom.g(ebuy361.dom.g('dose_not_exist_id'))报错的bug，by Meizz, dengping
    if ('string' == typeof id || id instanceof String) {
        return document.getElementById(id);
    } else if (id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
        return id;
    }
    return null;
};

/// support magic - ebuy361 1.x Code End




ebuy361.dom.extend({
    toggleClass: function(value,status){
        var type = typeof value;
        var status = (typeof status === 'undefined')? status : Boolean(status);

        if(arguments.length <= 0 ){
            ebuy361.forEach(this,function(item){
                item.className = '';
            });
        };

        switch(typeof value){
            case 'string':

                //对输入进行处理
                value = value.replace(/^\s+/g,'').replace(/\s+$/g,'').replace(/\s+/g,' ');

                var arr = value.split(' ');
                ebuy361.forEach(this, function(item){
                    var str = item.className;
                    for(var i = 0;i<arr.length;i++){

                        //有这个className
                        if((~(' '+str+' ').indexOf(' '+arr[i]+' '))&&(typeof status === 'undefined')){
                            str = (' '+str+' ').replace(' '+arr[i]+' ',' ');
                            
                        }else if((!~(' '+str+' ').indexOf(' '+arr[i]+' '))&&(typeof status === 'undefined')){
                            str += ' '+arr[i];

                        }else if((!~(' '+str+' ').indexOf(' '+arr[i]+' '))&&(status === true)){
                            str += ' '+arr[i];

                        }else if((~(' '+str+' ').indexOf(' '+arr[i]+' '))&&(status === false)){
                            str = str.replace(arr[i],'');
                        };
                    };
                    item.className = str.replace(/^\s+/g,'').replace(/\s+$/g,'');
                });
            break;
            case 'function':

                ebuy361.forEach(this, function(item, index){
                    ebuy361.dom(item).toggleClass(value.call(item, index, item.className),status);
                });

            break;
        };

        return this;
    }
});








ebuy361.dom.extend({
    hasClass: function(value){
        //异常处理
        if(arguments.length <= 0 || typeof value === 'function'){
            return this;
        };
        
        if(this.size()<=0){
            return false;
        };

        //对输入进行处理
        value = value.replace(/^\s+/g,'').replace(/\s+$/g,'').replace(/\s+/g,' ');
        var arr = value.split(' ');
        var result;
        ebuy361.forEach(this, function(item){
            var str = item.className;
            for(var i = 0;i<arr.length;i++){
                if(!~(' '+str+' ').indexOf(' '+arr[i]+' ')){
                    //有一个不含有
                    result = false;
                    return;
                };
            };
            if(result!==false){result = true;return;};
        });
        return result;
    }
});












ebuy361.dom.createElements = function() {
    var tagReg  = /<(\w+)/i,
        rhtml = /<|&#?\w+;/,
        tagMap  = {
            area    : [1, "<map>", "</map>"],
            col     : [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            legend  : [1, "<fieldset>", "</fieldset>"],
            option  : [1, "<select multiple='multiple'>", "</select>"],
            td      : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            thead   : [1, "<table>", "</table>"],
            tr      : [2, "<table><tbody>", "</tbody></table>"],
            _default: [0, "", ""]
        };

    // 建立映射
    tagMap.optgroup = tagMap.option;
    tagMap.tbody = tagMap.tfoot = tagMap.colgroup = tagMap.caption = tagMap.thead;
    tagMap.th = tagMap.td;

    // 将<script>解析成正常可执行代码
    function parseScript ( box, doc ) {
        var list = box.getElementsByTagName("SCRIPT"),
            i, script, item;

        for ( i=list.length-1; i>=0; i-- ) {
            item = list[ i ];
            script = doc.createElement( "SCRIPT" );

            item.id && (script.id = item.id);
            item.src && (script.src = item.src);
            item.type && (script.type = item.type);
            script[ item.text ? "text" : "textContent" ] = item.text || item.textContent;

            item.parentNode.replaceChild( script, item );
        }
    }

    return function( htmlstring, doc ) {
        ebuy361.isNumber( htmlstring ) && ( htmlstring = htmlstring.toString() );
        doc = doc || document;

        var wrap, depth, box,
            hs  = htmlstring,
            n   = hs.length,
            div = doc.createElement("div"),
            df  = doc.createDocumentFragment(),
            result = [];

        if ( ebuy361.isString( hs ) ) {
            if(!rhtml.test(hs)){// TextNode
                result.push( doc.createTextNode( hs ) );
            }else {//htmlString
                wrap = tagMap[ hs.match( tagReg )[1].toLowerCase() ] || tagMap._default;

                div.innerHTML = "<i>mz</i>" + wrap[1] + hs + wrap[2];
                div.removeChild( div.firstChild );  // for ie (<script> <style>)
                parseScript(div, doc);

                depth = wrap[0];
                box = div;
                while ( depth -- ) { box = box.firstChild; };

                ebuy361.merge( result, box.childNodes );

                // 去除 item.parentNode
                ebuy361.forEach( result, function (dom) {
                    df.appendChild( dom );
                } );

                div = box = null;
            }
        }

        div = null;

        return result;
    };
}();
















ebuy361.createChain("event",

    // method
    function(){
        var lastEvt = {};
        return function( event, json ){
            switch( ebuy361.type( event ) ){
                // event
                case "object":
                    return lastEvt.originalEvent === event ? 
                        lastEvt : lastEvt = new ebuy361.event.$Event( event );

                case "$Event":
                    return event;

                // event type
//                case "string" :
//                    var e = new ebuy361.event.$Event( event );
//                    if( typeof json == "object" ) 
//                        ebuy361.forEach( e, json );
//                    return e;
            }
        }
    }(),

    // constructor
    function( event ){
        var e, t, f;
        var me = this;

        this._type_ = "$Event";

        if( typeof event == "object" && event.type ){

            me.originalEvent = e = event;

            for( var name in e )
                if( typeof e[name] != "function" )
                    me[ name ] = e[ name ];

            if( e.extraData )
                ebuy361.extend( me, e.extraData );

            me.target = me.srcElement = e.srcElement || (
                ( t = e.target ) && ( t.nodeType == 3 ? t.parentNode : t )
            );

            me.relatedTarget = e.relatedTarget || (
                ( t = e.fromElement ) && ( t === me.target ? e.toElement : t )
            );

            me.keyCode = me.which = e.keyCode || e.which;

            // Add which for click: 1 === left; 2 === middle; 3 === right
            if( !me.which && e.button !== undefined )
                me.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) );

            var doc = document.documentElement, body = document.body;

            me.pageX = e.pageX || (
                e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0)
            );

            me.pageY = e.pageY || (
                e.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0)
            );

            me.data;
        }

        // event.type
//        if( typeof event == "string" )
//            this.type = event;

        // event.timeStamp
        this.timeStamp = new Date().getTime();
    }

).extend({
    stopPropagation : function() {
        var e = this.originalEvent;
        e && ( e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true );
    },

    preventDefault : function() {
        var e = this.originalEvent;
        e && ( e.preventDefault ? e.preventDefault() : e.returnValue = false );
    }
});


ebuy361._util_.eventBase = ebuy361._util_.eventBase || {};


void function( base, listener ){
    if( base.listener )return ;
    
    listener = base.listener = {};
    
    if( window.addEventListener )
        listener.add = function( target, name, fn ){
            target.addEventListener( name, fn, false );
        };
    else if( window.attachEvent )
        listener.add = function( target, name, fn ){
            target.attachEvent( "on" + name, fn );
        };
}( ebuy361._util_.eventBase );

void function( base, be ){
    if( base.queue )return ;

    var I = ebuy361.id;
    var queue = base.queue = {};
    var attaCache = queue.attaCache = ebuy361.global( "eventQueueCache" );
    var listener = base.listener;

    queue.get = function( target, type, bindType, attachElements ){
        var id = I( target ), c;

        if( !attaCache[id] )
            attaCache[id] = {};

        c = attaCache[id];

        if( type ){
            if( !c[type] && bindType ){
                this.setupCall( target, type, bindType, c[ type ] = [], attachElements );
            }
            return c[type] || [];
        }else return c;
    };

    queue.add = function( target, type, bindType, item, attachElements ){
        this.get( target, type, bindType, attachElements ).push( item );
    };

    queue.remove = function( target, type, fn ){
        var arr, c;
        if( type ){
            var arr = this.get( target, type );
            if( fn ){
                for(var i = arr.length - 1; i >= 0; i --)
                    if( arr[i].orig == fn )
                        arr.splice( i, 1 );
            }else{
                arr.length = 0;
            }
        }else{
            var c = this.get( target );
            for(var i in c)
                c[i].length = 0;
        }
    };
    
    queue.handlerList = function(target, fnAry){
        var handlerQueue = [];
        //对delegate进行处理，这里牺牲性能换取事件执行顺序
        for(var i = 0, item; item = fnAry[i]; i++){
            if(item.delegate
                && ebuy361.dom(item.delegate, target).size() < 1){
                continue;
            }
            handlerQueue.push(item);
        }
        return handlerQueue;
    }

    queue.call = function( target, type, fnAry, e ){
        if( fnAry ){
            if( !fnAry.length )
                return ;

            var args = [].slice.call( arguments, 1 ), one = [];
                args.unshift( e = ebuy361.event( e || type ) );          
                e.type = type;

            if( !e.currentTarget )
                e.currentTarget = target;

            if( !e.target )
                e.target = target;
                
            //这里加入判断处理delegate 过滤fnAry 类似jq的功能
            fnAry = queue.handlerList(target, fnAry);
            
            for( var i = 0, r, l = fnAry.length; i < l; i ++ )
                if(r = fnAry[i]){
                    r.pkg.apply( target, args );
                    if( r.one )
                        one.unshift( i );
                }

            if( one.length )
                for(var i = 0, l = one.length; i < l; i ++)
                    this.remove( target, type, fnAry[i].fn );
                
        }else{
            fnAry = this.get( target, type );
            this.call( target, type, fnAry, e );
        }
    };

    queue.setupCall = function(){
        var add = function( target, type, bindType, fnAry ){
            listener.add( target, bindType, function( e ){
                queue.call( target, type, fnAry, e );
            } );
        };
        return function( target, type, bindType, fnAry, attachElements ){
            if( !attachElements )
                add( target, type, bindType, fnAry );
            else{
                target = ebuy361.dom( attachElements, target );
                for(var i = 0, l = target.length; i < l; i ++)
                    add( target[i], type, bindType, fnAry );
            }
        };
    }();

}( ebuy361._util_.eventBase, ebuy361.event );

ebuy361._util_.cleanData = function(array){
    var tangId;
    for(var i = 0, ele; ele = array[i]; i++){
        tangId = ebuy361.id(ele, 'get');
        if(!tangId){continue;}
        ebuy361._util_.eventBase.queue.remove(ele);
        ebuy361.id(ele, 'remove');
    }
};




ebuy361.dom.extend({
    empty: function(){
        for(var i = 0, item; item = this[i]; i++){
            item.nodeType === 1 && ebuy361._util_.cleanData(item.getElementsByTagName('*'));
            while(item.firstChild){
                item.removeChild(item.firstChild);
            }
        }
        return this;
    }
});




ebuy361.dom.extend({
    html: function(value){

        var bd = ebuy361.dom,
            bt = ebuy361._util_,
            me = this,
            isSet = false,
            htmlSerialize = !!bt.support.dom.div.getElementsByTagName('link').length,
            leadingWhitespace = (bt.support.dom.div.firstChild.nodeType === 3),
            result;

        //当dom选择器为空时
        if( !this.size() )
            switch(typeof value){
                case 'undefined':
                    return undefined;
                default:
                    return me;
            }
        
        var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
        "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            rnoInnerhtml = /<(?:script|style|link)/i,
            rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
            rleadingWhitespace = /^\s+/,
            rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            rtagName = /<([\w:]+)/,
            wrapMap = {
                option: [ 1, "<select multiple='multiple'>", "</select>" ],
                legend: [ 1, "<fieldset>", "</fieldset>" ],
                thead: [ 1, "<table>", "</table>" ],
                tr: [ 2, "<table><tbody>", "</tbody></table>" ],
                td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
                col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
                area: [ 1, "<map>", "</map>" ],
                _default: [ 0, "", "" ]
            };
        wrapMap.optgroup = wrapMap.option;
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;

        // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
        // unless wrapped in a div with non-breaking characters in front of it.
        if ( !htmlSerialize )
            wrapMap._default = [ 1, "X<div>", "</div>" ];

        ebuy361.forEach( me, function( elem, index ){
            
            if( result )
                return;

            var ebuy361Dom = bd(elem);

            switch( typeof value ){
                case 'undefined':
                    result = ( elem.nodeType === 1 ? elem.innerHTML : undefined );
                    return ;
 
                case 'number':
                    value = String(value);

                case 'string':
                    isSet = true;

                    // See if we can take a shortcut and just use innerHTML
                    if ( !rnoInnerhtml.test( value ) &&
                        ( htmlSerialize || !rnoshimcache.test( value )  ) &&
                        ( leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
                        !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

                        value = value.replace( rxhtmlTag, "<$1></$2>" );

                        try {

                            // Remove element nodes and prevent memory leaks
                            if ( elem.nodeType === 1 ) {
                                ebuy361Dom.empty();
                                elem.innerHTML = value;
                            }

                            elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                        } catch(e) {}
                    }

                    if ( elem ) {
                        me.empty().append( value );
                    }

                break;

                case 'function':
                    isSet = true;
                    ebuy361Dom.html(value.call(elem, index, ebuy361Dom.html()));
                break;
            };
        });
        
        return isSet ? me : result;
    }
});

ebuy361._util_.smartInsert = function(tang, args, callback){
    if(args.length <= 0 || tang.size() <= 0){return;}
    if(ebuy361.type(args[0]) === 'function'){
        var fn = args[0],
            tangItem;
        return ebuy361.forEach(tang, function(item, index){
            tangItem = ebuy361.dom(item);
            args[0] = fn.call(item, index, tangItem.html());
            ebuy361._util_.smartInsert(tangItem, args, callback);
        });
    }
    var doc = tang.getDocument() || document,
        fragment = doc.createDocumentFragment(),
        len = tang.length - 1,
        firstChild;
    for(var i = 0, item; item = args[i]; i++){
        if(item.nodeType){
            fragment.appendChild(item);
        }else{
            ebuy361.forEach(~'string|number'.indexOf(ebuy361.type(item)) ?
                ebuy361.dom.createElements(item, doc)
                    : item, function(ele){
                        fragment.appendChild(ele);
                    });
        }
    }
    if(!(firstChild = fragment.firstChild)){return;}
    ebuy361.forEach(tang, function(item, index){
        callback.call(item.nodeName.toLowerCase() === 'table'
            && firstChild.nodeName.toLowerCase() === 'tr' ?
                item.tBodies[0] || item.appendChild(item.ownerDocument.createElement('tbody'))
                    : item, index < len ? fragment.cloneNode(true) : fragment);
    });
};





ebuy361.dom.extend({
    append: function(){
        ebuy361.check('^(?:string|function|HTMLElement|\\$DOM)(?:,(?:string|array|HTMLElement|\\$DOM))*$', 'ebuy361.dom.append');
        ebuy361._util_.smartInsert(this, arguments, function(child){
            this.nodeType === 1 && this.appendChild(child);
        });
        return this;
    }
});


ebuy361.dom.extend({
    prepend: function(){
        ebuy361.check('^(?:string|function|HTMLElement|\\$DOM)(?:,(?:string|array|HTMLElement|\\$DOM))*$', 'ebuy361.dom.prepend');
        ebuy361._util_.smartInsert(this, arguments, function(child){
            this.nodeType === 1 && this.insertBefore(child, this.firstChild);
        });
        return this;
    }
});


ebuy361.makeArray = function(array, results){
    var ret = results || [];
    if(!array){return ret;}
    array.length == null || ~'string|function|regexp'.indexOf(ebuy361.type(array)) ?
        [].push.call(ret, array) : ebuy361.merge(ret, array);
    return ret;
};











ebuy361.dom.extend({
    map : function (iterator) {
        ebuy361.check("function","ebuy361.dom.map");
        var ret = [],
            i = 0;

        ebuy361.forEach(this, function( dom, index ){
            ret[ i++ ] = iterator.call( dom, index, dom, dom );
        });

        return this.pushStack( ret );
    }
});





void function( base, be ){
    if( base.core )return ;

    var queue = base.queue;
    var core = base.core = {};
    var special = be.special = {};
    var push = [].push;

    var findVestedEl = function( target, parents ){
        for( var i = 0, l = parents.length; i < l; i ++ )
            if( parents.get(i).contains( target ) )
                return parents[i];
    };

    core.build = function( target, name, fn, selector, data ){

        var bindElements;

        if( selector )
            bindElements = ebuy361.dom( selector, target );

        if( ( name in special ) && special[name].pack )
            fn = special[name].pack( fn );

        return function( e ){ // e is instance of ebuy361.event()
            var t = ebuy361.dom( e.target ), args = [ e ], bindElement;

            if( data && !e.data ) 
                e.data = data;
            if( e.triggerData )
                push.apply( args, e.triggerData );

            if( !bindElements )
                return e.result = fn.apply( target, args );

            for(var i = 0; i < 2; i ++){
                if( bindElement = findVestedEl( e.target, bindElements ) )
                    return e.result = fn.apply( bindElement, args );
                bindElements = ebuy361.dom( selector, target );
            }
        };
    };

    core.add = function( target, type, fn, selector, data, one ){
        var pkg = this.build( target, type, fn, selector, data ), attachElements, bindType;
        bindType = type;
        if(type in special)
            attachElements = special[type].attachElements,
            bindType = special[type].bindType || type;

        queue.add( target, type, bindType, { type: type, pkg: pkg, orig: fn, one: one, delegate: selector }, attachElements );
    };

    core.remove = function( target, type, fn, selector ){
        queue.remove( target, type, fn, selector );
    };

}( ebuy361._util_.eventBase, ebuy361.event );





ebuy361.dom.extend({
    clone: function(){
        var util = ebuy361._util_,
            eventCore = util.eventBase.core,
            eventQueue = util.eventBase.queue,
            div = util.support.dom.div,
            noCloneChecked = util.support.dom.input.cloneNode(true).checked,//用于判断ie是否支持clone属性
            noCloneEvent = true;
        if (!div.addEventListener && div.attachEvent && div.fireEvent){
            div.attachEvent('onclick', function(){noCloneEvent = false;});
            div.cloneNode(true).fireEvent('onclick');
        }
        //
        function getAll(ele){
            return ele.getElementsByTagName ? ele.getElementsByTagName('*')
                : (ele.querySelectorAll ? ele.querySelectorAll('*') : []);
        }
        //
        function cloneFixAttributes(src, dest){
            dest.clearAttributes && dest.clearAttributes();
            dest.mergeAttributes && dest.mergeAttributes(src);
            switch(dest.nodeName.toLowerCase()){
                case 'object':
                    dest.outerHTML = src.outerHTML;
                    break;
                case 'textarea':
                case 'input':
                    if(~'checked|radio'.indexOf(src.type)){
                        src.checked && (dest.defaultChecked = dest.checked = src.checked);
                        dest.value !== src.value && (dest.value = src.value);
                    }
                    dest.defaultValue = src.defaultValue;
                    break;
                case 'option':
                    dest.selected = src.defaultSelected;
                    break;
                case 'script':
                    dest.text !== src.text && (dest.text = src.text);
                    break;
            }
            dest[ebuy361.key] && dest.removeAttribute(ebuy361.key);
        }
        //
        function cloneCopyEvent(src, dest){
            if(dest.nodeType !== 1 || !ebuy361.id(src, 'get')){return;}
            var defaultEvents = eventQueue.get(src);
            for(var i in defaultEvents){
                for(var j = 0, handler; handler = defaultEvents[i][j]; j++){
                    eventCore.add(dest, i, handler.orig, null, null, handler.one);
                }
            }
        }
        //
        function clone(ele, dataAndEvents, deepDataAndEvents){
            var cloneNode = ele.cloneNode(true),
                srcElements, destElements, len;
            //IE
            if((!noCloneEvent || !noCloneChecked)
                && (ele.nodeType === 1 || ele.nodeType === 11) && !ebuy361._util_.isXML(ele)){
                    cloneFixAttributes(ele, cloneNode);
                    srcElements = getAll( ele );
                    destElements = getAll( cloneNode );
                    len = srcElements.length;
                    for(var i = 0; i < len; i++){
                        destElements[i] && cloneFixAttributes(srcElements[i], destElements[i]);
                    }
            }
            if(dataAndEvents){
                cloneCopyEvent(ele, cloneNode);
                if(deepDataAndEvents){
                    srcElements = getAll( ele );
                    destElements = getAll( cloneNode );
                    len = srcElements.length;
                    for(var i = 0; i < len; i++){
                        cloneCopyEvent(srcElements[i], destElements[i]);
                    }
                }
            }
            return cloneNode;
        }
        //
        return function(dataAndEvents, deepDataAndEvents){
            dataAndEvents = !!dataAndEvents;
            deepDataAndEvents = !!deepDataAndEvents;
            return this.map(function(){
                return clone(this, dataAndEvents, deepDataAndEvents);
            });
        }
    }()
});







 
ebuy361.dom.extend({
    contains : function(contained) {
        var container = this[0];
            contained = ebuy361.dom(contained)[0];
        if(!container || !contained){return false;}
        return ebuy361._util_.contains(container, contained);
    }    
});







ebuy361._util_.smartInsertTo = function(tang, target, callback, orie){
    var insert = ebuy361.dom(target),
        first = insert[0],
        tangDom;
        
    if(orie && first && (!first.parentNode || first.parentNode.nodeType === 11)){
        orie = orie === 'before';
        tangDom = ebuy361.merge(orie ? tang : insert, !orie ? tang : insert);
        if(tang !== tangDom){
            tang.length = 0;
            ebuy361.merge(tang, tangDom);
        }
    }else{
        for(var i = 0, item; item = insert[i]; i++){
            ebuy361._util_.smartInsert(ebuy361.dom(item), i > 0 ? tang.clone(true, true) : tang, callback);
        }
    }
};


ebuy361.dom.extend({
    appendTo: function(target){
        var ret = [],
            array_push = ret.push;

        ebuy361.check('^(?:string|HTMLElement|\\$DOM)$', 'ebuy361.dom.appendTo');
        ebuy361._util_.smartInsertTo(this, target, function(child){
            array_push.apply(ret, ebuy361.makeArray(child.childNodes));
            this.appendChild(child);
        });
        return this.pushStack(ret);
    }
});




ebuy361.dom.extend({
    prependTo: function(target){
        var ret = [],
            array_push = ret.push;
        ebuy361.check('^(?:string|HTMLElement|\\$DOM)$', 'ebuy361.dom.prependTo');
        ebuy361._util_.smartInsertTo(this, target, function(child){
            array_push.apply(ret, ebuy361.makeArray(child.childNodes));
            this.insertBefore(child, this.firstChild);
        });
        return this.pushStack( ret );
    }
});






ebuy361.dom.extend({
    after: function(){
        ebuy361.check('^(?:string|function|HTMLElement|\\$DOM)(?:,(?:string|array|HTMLElement|\\$DOM))*$', 'ebuy361.dom.after');

        ebuy361._util_.smartInsert(this, arguments, function(node){
            this.parentNode && this.parentNode.insertBefore(node, this.nextSibling);
        });

        return this;
    }
});




ebuy361.dom.extend({
    before: function(){
        ebuy361.check('^(?:string|function|HTMLElement|\\$DOM)(?:,(?:string|array|HTMLElement|\\$DOM))*$', 'ebuy361.dom.before');

        ebuy361._util_.smartInsert(this, arguments, function(node){
            this.parentNode && this.parentNode.insertBefore(node, this);
        });

        return this;
    }
});






ebuy361.dom.extend({
    insertAfter: function(target){
        var ret = [],
            array_push = ret.push;

        ebuy361.check('^(?:string|HTMLElement|\\$DOM)$', 'ebuy361.dom.insertAfter');

        ebuy361._util_.smartInsertTo(this, target, function(node){
            array_push.apply(ret, ebuy361.makeArray(node.childNodes));
            this.parentNode.insertBefore(node, this.nextSibling);
        }, 'after');

        return this.pushStack(ret);
    }
});











ebuy361.dom.extend({
    insertBefore: function(target){
        var ret = [],
            array_push = ret.push;
        ebuy361.check('^(?:string|HTMLElement|\\$DOM)$', 'ebuy361.dom.insertBefore');
        ebuy361._util_.smartInsertTo(this, target, function(node){
            array_push.apply(ret, ebuy361.makeArray(node.childNodes));
            this.parentNode.insertBefore(node, this);
        }, 'before');
        return this.pushStack(ret);
    }
});
















ebuy361.dom.match = function(){
    var reg = /^[\w\#\-\$\.\*]+$/,

        // 使用这个临时的 div 作为CSS选择器过滤
        div = document.createElement("DIV");
        div.id = "__ebuy361__";

    return function( array, selector, context ){
        var root, results = ebuy361.array();

        switch ( ebuy361.type(selector) ) {
            // 取两个 ebuy361Dom 的交集
            case "$DOM" :
                for (var x=array.length-1; x>-1; x--) {
                    for (var y=selector.length-1; y>-1; y--) {
                        array[x] === selector[y] && results.push(array[x]);
                    }
                }
                break;

            // 使用过滤器函数，函数返回值是 Array
            case "function" :
                ebuy361.forEach(array, function(item, index){
                    selector.call(item, index) && results.push(item);
                });
                break;
            
            case "HTMLElement" :
                ebuy361.forEach(array, function(item){
                    item == selector && results.push(item);
                });
                break;

            // CSS 选择器
            case "string" :
                var da = ebuy361.query(selector, context || document);
                ebuy361.forEach(array, function(item){
                    if ( root = getRoot(item) ) {
                        var t = root.nodeType == 1
                            // in DocumentFragment
                            ? ebuy361.query(selector, root)
                            : da;

                        for (var i=0, n=t.length; i<n; i++) {
                            if (t[i] === item) {
                                results.push(item);
                                break;
                            }
                        }
                    }
                });
                results = results.unique();
                break;

            default :
                results = ebuy361.array( array ).unique();
                break;
        }
        return results;

    };

    function getRoot(dom) {
        var result = [], i;

        while(dom = dom.parentNode) {
            dom.nodeType && result.push(dom);
        }

        for (var i=result.length - 1; i>-1; i--) {
            // 1. in DocumentFragment
            // 9. Document
            if (result[i].nodeType == 1 || result[i].nodeType == 9) {
                return result[i];
            }
        }
        return null;
    }
}();











ebuy361.dom.extend({
    filter : function (selector) {
        return this.pushStack( ebuy361.dom.match(this, selector) );
    }
});




ebuy361.dom.extend({
    remove: function(selector, keepData){
        arguments.length > 0
            && ebuy361.check('^string(?:,boolean)?$', 'ebuy361.dom.remove');
        var array = selector ? this.filter(selector) : this;
        for(var i = 0, ele; ele = array[i]; i++){
           if(!keepData && ele.nodeType === 1){
               ebuy361._util_.cleanData(ele.getElementsByTagName('*'));
               ebuy361._util_.cleanData([ele]);
            }
            ele.parentNode && ele.parentNode.removeChild(ele);
        }
        return this;
    }
});


ebuy361.dom.extend({
    detach: function(selector){
        selector && ebuy361.check('^string$', 'ebuy361.dom.detach');
        return this.remove(selector, true);
    }
});




ebuy361.dom.extend({
    getWindow: function(){
        var doc = this.getDocument();
        return (this.size()<=0)? undefined :(doc.parentWindow || doc.defaultView);
    }
});



ebuy361.dom.extend({
    text: function(value){

        var bd = ebuy361.dom,
            me = this,
            isSet = false,
            result;

        //当dom选择器为空时
        if(this.size()<=0){
            switch(typeof value){
                case 'undefined':
                    return undefined;
                // break;
                default:
                    return me;
                // break;
            }            
        }

        
        var getText = function( elem ) {
            var node,
                ret = "",
                i = 0,
                nodeType = elem.nodeType;

            if ( nodeType ) {
                if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
                    // Use textContent for elements
                    // innerText usage removed for consistency of new lines (see #11153)
                    if ( typeof elem.textContent === "string" ) {
                        return elem.textContent;
                    } else {
                        // Traverse its children
                        for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                            ret += getText( elem );
                        }
                    }
                } else if ( nodeType === 3 || nodeType === 4 ) {
                    return elem.nodeValue;
                }
                // Do not include comment or processing instruction nodes
            }
            //  else {

            //     // If no nodeType, this is expected to be an array
            //     for ( ; (node = elem[i]); i++ ) {
            //         // Do not traverse comment nodes
            //         ret += getText( node );
            //     }
            // }
            return ret;
        };

        ebuy361.forEach(me,function(elem, index){
            
            var ebuy361Dom = bd(elem);
            if(result){return;};

            switch(typeof value){
                case 'undefined':
        
                    //get first
                    result = getText(elem);
                    return result;

                // break;

                case 'number':
                    value = String(value);
                case 'string':

                    //set all
                    isSet = true;
                    ebuy361Dom.empty().append( ( elem && elem.ownerDocument || document ).createTextNode( value ) );
                break;

                case 'function':

                    //set all
                    isSet = true;
                    ebuy361Dom.text(value.call(elem, index, ebuy361Dom.text()));

                break;
            };
        });

        return isSet?me:result;
    }
});











ebuy361.dom.extend({
    find : function (selector) {
        var a=[],
            expr,
            id = "__ebuy361__find__",
            td = [];

        switch (ebuy361.type(selector)) {
        case "string" :
            this.each(function(){ebuy361.merge(td, ebuy361.query(selector, this));});
            break;
        case "HTMLElement" :
            expr = selector.tagName +"#"+ (selector.id ? selector.id : (selector.id = id));
            this.each(function(){if(ebuy361.query(expr, this).length > 0) a.push(selector);});
            selector.id == id && (selector.id = "");
            if (a.length > 0) ebuy361.merge(td, a);
            break;
        case "$DOM" :
            a = selector.get();
            this.each(function(){
                ebuy361.forEach(ebuy361.query("*", this), function(dom){
                    for (var i=0, n=a.length; i<n; i++) {
                        dom === a[i] && (td[td.length ++] = a[i]);
                    }
                });
            });
            break;        
        }
        return this.pushStack( td );
    }
});



ebuy361._util_.inArray = function(ele, array, index){
    if(!array){return -1;}
    var indexOf = Array.prototype.indexOf,
        len;
    if(indexOf){return indexOf.call(array, ele, index);}
    len = array.length;
    index = index ? index < 0 ? Math.max(0, len + index) : index : 0;
    for(; index < len; index++){
        if(index in array && array[index] === ele){
            return index;
        }
    }
    return -1;
};











ebuy361.array.extend({
    map: function(iterator, context){
        ebuy361.check("function(,.+)?","ebuy361.array.map");
        var len = this.length,
            array = ebuy361.array([]);
        for(var i = 0; i < len; i++){
            array[i] = iterator.call(context || this, this[i], i, this);
        }
        return array;
    }
});






ebuy361.dom.extend({
    val: function(){
        ebuy361._util_.support.dom.select.disabled = true;
        var util = ebuy361._util_,
            checkOn = util.support.dom.input.value === 'on',
            optDisabled = !util.support.dom.opt.disabled,
            inputType = ['radio', 'checkbox'],
            valHooks = {
                option: {
                    get: function(ele){
                        var val = ele.attributes.value;
                        return !val || val.specified ? ele.value : ele.text;
                    }
                },
                select: {
                    get: function(ele){
                        var options = ele.options,
                            index = ele.selectedIndex,
                            one = ele.type === 'select-one' || index < 0,
                            ret = one ? null : [],
                            len = one ? index + 1 : options.length,
                            i = index < 0 ? len : one ? index : 0,
                            item, val;
                        for(; i < len; i++){
                            item = options[i];
                            if((item.selected || i === index)
                                && (optDisabled ? !item.disabled : item.getAttribute('disabled') === null)
                                && (!item.parentNode.disabled || !util.nodeName(item.parentNode, 'optgroup'))){
                                val = ebuy361.dom(item).val();
                                if(one){return val;}
                                ret.push(val);
                            }
                        }
                        return ret;
                    },
                    set: function(ele, key, val){
                        var ret = ebuy361.makeArray(val);
                        ebuy361.dom(ele).find('option').each(function(index, item){
                            item.selected = util.inArray(ebuy361.dom(this).val(), ret) >= 0;
                        });
                        !ret.length && (ele.selectedIndex = -1);
                        return ret;
                    }
                }
            };
        !util.support.getSetAttribute && (valHooks.button = util.nodeHook);
        if(!checkOn){
            ebuy361.forEach(inputType, function(item){
                valHooks[item] = {
                    get: function(ele){
                        return ele.getAttribute('value') === null ? 'on' : ele.value;
                    }
                };
            });
        }
        ebuy361.forEach(inputType, function(item){
            valHooks[item] = valHooks[item] || {};
            valHooks[item].set = function(ele, key, val){
                if(ebuy361.type(val) === 'array'){
                    return (ele.checked = util.inArray(ebuy361.dom(ele).val(), val) >= 0);
                }
            }
        });
        
        return function(value){
            var ele, hooks;
            if(value === undefined){
                if(!(ele = this[0])){return;}
                hooks = valHooks[ele.type] || valHooks[ele.nodeName.toLowerCase()] || {};
                return hooks.get && hooks.get(ele, 'value') || ele.value;
            }
            this.each(function(index, item){
                if(item.nodeType !== 1){return;}
                var tang = ebuy361.dom(item),
                    val = ebuy361.type(value) === 'function' ?
                        value.call(item, index, tang.val()) : value;
                if(val == null){
                    val = '';
                }else if(ebuy361.type(val) === 'number'){
                    val += '';
                }else if(ebuy361.type(val) === 'array'){
                    val = ebuy361.array(val).map(function(it){
                        return it == null ? '' : it + '';
                    });
                }
                hooks = valHooks[item.type] || valHooks[item.nodeName.toLowerCase()] || {};
                if(!hooks.set || hooks.set(item, 'value', val) === undefined){
                    item.value = val;
                }
            });
            return this;
        }
    }()
});





//ebuy361.browser.opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined;






ebuy361.dom.extend({
    insertHTML: function ( position, html) {
        var range,begin,element = this[0];
    
        //在opera中insertAdjacentHTML方法实现不标准，如果DOMNodeInserted方法被监听则无法一次插入多element
        //by lixiaopeng @ 2011-8-19
        if (element.insertAdjacentHTML && !ebuy361.browser.opera) {
            element.insertAdjacentHTML(position, html);
        } else {
            // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
            // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
            range = element.ownerDocument.createRange();
            // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
            // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
            position = position.toUpperCase();
            if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
                range.selectNodeContents(element);
                range.collapse(position == 'AFTERBEGIN');
            } else {
                begin = position == 'BEFOREBEGIN';
                range[begin ? 'setStartBefore' : 'setEndAfter'](element);
                range.collapse(begin);
            }
            range.insertNode(range.createContextualFragment(html));
        }
        return element;
    }
});








ebuy361.dom.extend({
    offsetParent: function(){
        return this.map(function(){
            var offsetParent = this.offsetParent || document.body,
                exclude = /^(?:body|html)$/i;
            while(offsetParent && ebuy361.dom(offsetParent).getCurrentStyle('position') === 'static'
                && !exclude.test(offsetParent.nodeName)){
                    offsetParent = offsetParent.offsetParent;
            }
            return offsetParent;
        });
    }
});


ebuy361.dom.extend({
    position: function(){
        if(this.size()<=0){return 0;}        
        var patrn = /^(?:body|html)$/i,
            coordinate = this.offset(),
            offsetParent = this.offsetParent(),
            parentCoor = patrn.test(offsetParent[0].nodeName) ? {left: 0, top: 0}
                : offsetParent.offset();
        coordinate.left -= parseFloat(this.getCurrentStyle('marginLeft')) || 0;
        coordinate.top -= parseFloat(this.getCurrentStyle('marginTop')) || 0;
        parentCoor.left += parseFloat(offsetParent.getCurrentStyle('borderLeftWidth')) || 0;
        parentCoor.top += parseFloat(offsetParent.getCurrentStyle('borderTopWidth')) || 0;
        return {
            left: coordinate.left - parentCoor.left,
            top: coordinate.top - parentCoor.top
        }
    }
});






ebuy361.dom.extend({
    offset: function(){
        
        function setOffset(ele, options, index){
            var tang = tang = ebuy361.dom(ele),
                position = tang.getCurrentStyle('position');
            position === 'static' && (ele.style.position = 'relative');
            var currOffset = tang.offset(),
                currLeft = tang.getCurrentStyle('left'),
                currTop = tang.getCurrentStyle('top'),
                calculatePosition = (~'absolute|fixed'.indexOf(position)) && ~('' + currLeft + currTop).indexOf('auto'),
                curPosition = calculatePosition && tang.position();
            currLeft = curPosition && curPosition.left || parseFloat(currLeft) || 0;
            currTop = curPosition && curPosition.top || parseFloat(currTop) || 0;
            ebuy361.type('options') === 'function' && (options = options.call(ele, index, currOffset));
            options.left != undefined && (ele.style.left = options.left - currOffset.left + currLeft + 'px');
            options.top != undefined && (ele.style.top = options.top - currOffset.top + currTop + 'px');
        }
        
        return function(options){
            if(options){
                ebuy361.check('^(?:object|function)$', 'ebuy361.dom.offset');
                for(var i = 0, item; item = this[i]; i++){
                    setOffset(item, options, i);
                }
                return this;
            }
            var ele = this[0],
                doc = this.getDocument(),
                box = {left: 0, top: 0},
                win, docElement;
            if(!doc){return;}
            docElement = doc.documentElement;
            if(!ebuy361._util_.contains(docElement, ele)){return box;}
            (typeof ele.getBoundingClientRect) !== 'undefined' && (box = ele.getBoundingClientRect());
            win = this.getWindow();
            return {
                left: box.left + (win.pageXOffset || docElement.scrollLeft) - (docElement.clientLeft || 0),
                top: box.top  + (win.pageYOffset || docElement.scrollTop)  - (docElement.clientTop  || 0)
            };
        }
    }()
});





//ebuy361.browser.isStrict = document.compatMode == "CSS1Compat";

ebuy361._util_.smartScroll = function(axis){
    var orie = {scrollLeft: 'pageXOffset', scrollTop: 'pageYOffset'}[axis],
        is = axis === 'scrollLeft',
        ret = {};
    function isDocument(ele){
        return ele && ele.nodeType === 9;
    }
    function getWindow(ele){
        return ebuy361.type(ele) == "Window" ? ele
            : isDocument(ele) ? ele.defaultView || ele.parentWindow : false;
    }
    return {
        get: function(ele){
            var win = getWindow(ele);
            return win ? (orie in win) ? win[orie]
                : ebuy361.browser.isStrict && win.document.documentElement[axis]
                    || win.document.body[axis] : ele[axis];
        },
        
        set: function(ele, val){
            if(!ele){return;}
            var win = getWindow(ele);
            win ? win.scrollTo(is ? val : this.get(ele), !is ? val : this.get(ele))
                : ele[axis] = val;
        }
    };
};


ebuy361.dom.extend({
    scrollLeft: function(){
        var ret = ebuy361._util_.smartScroll('scrollLeft');
        return function(value){
            value && ebuy361.check('^(?:number|string)$', 'ebuy361.dom.scrollLeft');
            if(this.size()<=0){
                return value === undefined ? 0 : this;
            };
            return value === undefined ? ret.get(this[0])
                : ret.set(this[0], value) || this;
        }
    }()
});





ebuy361.dom.extend({
    scrollTop: function(){
        var ret = ebuy361._util_.smartScroll('scrollTop');
        return function(value){
            value && ebuy361.check('^(?:number|string)$', 'ebuy361.dom.scrollTop');
            if(this.size()<=0){
                return value === undefined ? 0 : this;
            };
            return value === undefined ? ret.get(this[0])
                : ret.set(this[0], value) || this;
        }
    }()
});








ebuy361._util_.getWindowOrDocumentWidthOrHeight = ebuy361._util_.getWindowOrDocumentWidthOrHeight || function(){
    var ret = {'window': {}, 'document': {}};
    ebuy361.forEach(['Width', 'Height'], function(item){
        var clientProp = 'client' + item,
            offsetProp = 'offset' + item,
            scrollProp = 'scroll' + item;
        ret['window']['get' + item] = function(ele){
            var doc = ele.document,
                rectValue = doc.documentElement[clientProp];
            return ebuy361.browser.isStrict && rectValue
                || doc.body && doc.body[clientProp] || rectValue;
        };
        ret['document']['get' + item] = function(ele){
            var doc = ele.documentElement;
            return doc[clientProp] >= doc[scrollProp] ? doc[clientProp]
                : Math.max(ele.body[scrollProp], doc[scrollProp], ele.body[offsetProp], doc[offsetProp]);
        }
    });
    return function(ele, type, key){
        return ret[type][key === 'width' ? 'getWidth' : 'getHeight'](ele);
    }
}();



ebuy361.dom.extend({
    width: function(value){
        return ebuy361._util_.access(this, 'width', value, function(ele, key, val){
            var hasValue = val !== undefined,
                parseValue = hasValue && parseFloat(val),
                type = ele != null && ele == ele.window ? 'window'
                    : (ele.nodeType === 9 ? 'document' : false);
            if(hasValue && parseValue < 0 || isNaN(parseValue)){return;}
            hasValue && /^(?:\d*\.)?\d+$/.test(val += '') && (val += 'px');
            return type ? ebuy361._util_.getWindowOrDocumentWidthOrHeight(ele, type, key)
                : (hasValue ? ele.style.width = val : ebuy361._util_.getWidthOrHeight(ele, key));
        });
    }
});



 



ebuy361.dom.extend({
    height: function(value){
        return ebuy361._util_.access(this, 'height', value, function(ele, key, val){
            var hasValue = val !== undefined,
                parseValue = hasValue && parseFloat(val),
                type = ele != null && ele == ele.window ? 'window'
                    : (ele.nodeType === 9 ? 'document' : false);
            if(hasValue && parseValue < 0 || isNaN(parseValue)){return;}
            hasValue && /^(?:\d*\.)?\d+$/.test(val += '') && (val += 'px');
            return type ? ebuy361._util_.getWindowOrDocumentWidthOrHeight(ele, type, key)
                : (hasValue ? ele.style.height = val : ebuy361._util_.getWidthOrHeight(ele, key));
        });
    }
});



ebuy361.dom.extend({
    innerWidth: function(){
        if(this.size()<=0){return 0;}
        var ele = this[0],
            type = ele != null && ele === ele.window ? 'window'
                : (ele.nodeType === 9 ? 'document' : false);
        return type ? ebuy361._util_.getWindowOrDocumentWidthOrHeight(ele, type, 'width')
            : ebuy361._util_.getWidthOrHeight(ele, 'width', 'padding');
    }
});



ebuy361.dom.extend({
    innerHeight: function(){
        if(this.size()<=0){
            return 0;
        }
        var ele = this[0],
            type = ele != null && ele === ele.window ? 'window'
                : (ele.nodeType === 9 ? 'document' : false);
        return type ? ebuy361._util_.getWindowOrDocumentWidthOrHeight(ele, type, 'height')
            : ebuy361._util_.getWidthOrHeight(ele, 'height', 'padding');
    }
});



ebuy361.dom.extend({
    outerWidth: function(margin){
        if(this.size()<=0){return 0;}     
        var ele = this[0],
            type = ele != null && ele === ele.window ? 'window'
                : (ele.nodeType === 9 ? 'document' : false);
        return type ? ebuy361._util_.getWindowOrDocumentWidthOrHeight(ele, type, 'width')
            : ebuy361._util_.getWidthOrHeight(ele, 'width', 'padding|border' + (margin ? '|margin' : ''));
    }
});



ebuy361.dom.extend({
    outerHeight: function(margin){
        if(this.size()<=0){return 0;}
        var ele = this[0],
            type = ele != null && ele === ele.window ? 'window'
                : (ele.nodeType === 9 ? 'document' : false);
        return type ? ebuy361._util_.getWindowOrDocumentWidthOrHeight(ele, type, 'height')
            : ebuy361._util_.getWidthOrHeight(ele, 'height', 'padding|border' + (margin ? '|margin' : ''));
    }
});









ebuy361.dom.extend({
    on: function( events, selector, data, fn, _one ){
        var eb = ebuy361._util_.eventBase.core;
        // var specials = { mouseenter: 1, mouseleave: 1, focusin: 1, focusout: 1 };

        if( typeof selector == "object" && selector )
            fn = data,
            data = selector,
            selector = null;
        else if( typeof data == "function" )
            fn = data,
            data = null;
        else if( typeof selector == "function" )
            fn = selector,
            selector = data = null;

        if( typeof events == "string" ){
            events = events.split(/[ ,]+/);
            this.each(function(){
                ebuy361.forEach(events, function( event ){
                    // if( specials[ event ] )
                    //     ebuy361( this )[ event ]( data, fn );
                    // else
                    eb.add( this, event, fn, selector, data, _one );
                }, this);
            });
        }else if( typeof events == "object" ){
            if( fn )
                fn = null;
            ebuy361.forEach(events, function( fn, eventName ){
                this.on( eventName, selector, data, fn, _one );
            }, this);
        }

        return this;
    }

    // _on: function( name, data, fn ){
    //     var eb = ebuy361._util_.eventBase;
    //     this.each(function(){
    //         eb.add( this, name, fn, undefined, data );
    //     });
    //     return this;
    // }
});

/// support - magic ebuy361 1.x Code Start

ebuy361.event.on = ebuy361.on = function( element, evtName, handler ){
    if( typeof element == "string" )
        element = ebuy361.dom.g( element );
    ebuy361.dom( element ).on( evtName.replace(/^\s*on/, ""), handler );
    return element;
};
/// support - magic ebuy361 1.x Code End







ebuy361.dom.extend({
    off: function( events, selector, fn ){
        var eb = ebuy361._util_.eventBase.core, me = this;
        if( !events )
            ebuy361.forEach( this, function( item ){
                eb.remove( item );
            } );
        else if( typeof events == "string" ){
            if( typeof selector == "function" )
                fn = selector,
                selector = null;
            events = events.split(/[ ,]/);
            ebuy361.forEach( this, function( item ){
                ebuy361.forEach( events, function( event ){
                    eb.remove( item, event, fn, selector );
                });
            });
        }else if( typeof events == "object" )
            ebuy361.forEach( events, function(fn, event){
                me.off( event, selector, fn );
            } );

        return this;
    }
});

/// support - magic ebuy361 1.x Code Start

ebuy361.event.un = ebuy361.un = function(element, evtName, handler){
    if( typeof element == "string" )
        element = ebuy361.dom.g( element );
    ebuy361.dom(element).off(evtName.replace(/^\s*on/, ''), handler);
    return element;
 };
 /// support - magic ebuy361 1.x Code End



ebuy361.dom.extend({
    bind: function( type, data, fn ){
        return this.on( type, undefined, data, fn );
    }
});



ebuy361.dom.extend({
    unbind: function(type, fn){
        return this.off(type, fn);
    }
});








void function( special ){
    if( special.mousewheel )return ;
    var ff = /firefox/i.test(navigator.userAgent), 
        ie = /msie/i.test(navigator.userAgent);

    ebuy361.each( { mouseenter: "mouseover", mouseleave: "mouseout" }, function( name, fix ){
        special[ name ] = {
            bindType: fix,
            pack: function( fn ){
                var contains = ebuy361.dom.contains;
                return function( e ){ // e instance of ebuy361.event
                    var related = e.relatedTarget;
                    e.type = name;
                    if( !related || ( related !== this && !contains( this, related ) ) )
                        return fn.apply( this, arguments );
                }
            }
        }
    } );

    if( !ie )
        ebuy361.each( { focusin: "focus", focusout: "blur" }, function( name, fix ){
            special[ name ] = {
                bindType: fix,
                attachElements: "textarea,select,input,button,a"
            }
        } );

    special.mousewheel = {
        bindType: ff ? "DOMMouseScroll" : "mousewheel",
        pack: function( fn ){
            return function( e ){ // e instance of ebuy361.event
                var oe = e.originalEvent;
                e.type = "mousewheel";
                e.wheelDelta = e.wheelDelta || ( ff ? oe.detail * -40 : oe.wheelDelta ) || 0;
                return fn.apply( this, arguments );
            }
        }
    };

}( ebuy361.event.special );




void function( base ){
    var queue = base.queue;

    ebuy361.dom.extend({
        triggerHandler: function( type, triggerData, _e ){
            if( _e && !_e.triggerData )
                _e.triggerData = triggerData;

            ebuy361.forEach(this, function(item){
                queue.call( item, type, undefined, _e );
            });
            return this;
        }
    });

}( ebuy361._util_.eventBase );



void function( base, be ){
    var special = be.special;
    var queue = base.queue;
    var dom = ebuy361.dom;

    var ie = !window.addEventListener, firefox = /firefox/i.test(navigator.userAgent);

    var abnormals = { submit: 3, focus: ie ? 3 : 2, blur: ie ? 3 : firefox ? 1 : 2 };

    var createEvent = function( type, opts ){
        var evnt;

        if( document.createEvent )
            evnt = document.createEvent( "HTMLEvents" ),
            evnt.initEvent( type, true, true );
        else if( document.createEventObject )
            evnt = document.createEventObject(),
            evnt.type = type;

        var extraData = {};

           if( opts )for( var name in opts )
               try{
                   evnt[ name ] = opts[ name ];
               }catch(e){
                   if( !evnt.extraData )
                       evnt.extraData = extraData;
                   extraData[ name ] = opts[ name ];
               }

        return evnt;
    };

    var dispatchEvent = function( element, type, event ){
       if( element.dispatchEvent )
           return element.dispatchEvent( event );
       else if( element.fireEvent )
           return element.fireEvent( "on" + type, event );
    };

//    var upp = function( str ){
//        return str.toLowerCase().replace( /^\w/, function( s ){
//            return s.toUpperCase();
//        } );
//    };

    var fire = function( element, type, triggerData, _eventOptions, special ){
        var evnt, eventReturn;

        if( evnt = createEvent( type, _eventOptions ) ){
            if( triggerData )
                evnt.triggerData = triggerData;
            
            if( special )
                queue.call( element, type, null, evnt );
            else{
                var abnormalsType = element.window === window ? 3 : abnormals[ type ];

                try{
                    if( abnormalsType & 1 || !( type in abnormals ) )
                        eventReturn = dispatchEvent( element, type, evnt );
                }catch(e){
                    dom( element ).triggerHandler( type, triggerData, evnt );
                }

                if( eventReturn !== false && abnormalsType & 2 ){
                    try{
                        if( element[ type ] )
                            element[ type ]();
                    }catch(e){
                    }
                }
            }
        }
    };

    ebuy361.dom.extend({
        trigger: function( type, triggerData, _eventOptions ){
            var sp;

            if( type in special )
                sp = special[type];

            this.each(function(){
                fire( this, type, triggerData, _eventOptions, sp );
            });

            return this;
        }
    });
}( ebuy361._util_.eventBase, ebuy361.event );












ebuy361.array.extend({
    indexOf : function (match, fromIndex) {
        ebuy361.check(".+(,number)?","ebuy361.array.indexOf");
        var len = this.length;

        // 小于 0
        (fromIndex = fromIndex | 0) < 0 && (fromIndex = Math.max(0, len + fromIndex));

        for ( ; fromIndex < len; fromIndex++) {
            if(fromIndex in this && this[fromIndex] === match) {
                return fromIndex;
            }
        }
        
        return -1;
    }
});



























ebuy361.createChain('Callbacks', function(options){
    var opts = options;
    if(ebuy361.type(options) === 'string'){
        opts = {};
        ebuy361.forEach(options.split(/\s/), function(item){
            opts[item] = true;
        });
    }
    return new ebuy361.Callbacks.$Callbacks(opts);
}, function(options){
    var opts = ebuy361.extend({}, options || {}),
        fnArray = [],
        fireQueue = [],
        fireIndex = 0,
        memory, isLocked, isFired, isFiring,
        fireCore = function(data, index){
            var item, fn;
            if(!fireQueue || !fnArray){return;}
            memory = opts.memory && data;
            isFired = true;
            fireQueue.push(data);
            if(isFiring){return;}
            isFiring = true;
            while(item = fireQueue.shift()){
                for(fireIndex = index || 0; fn = fnArray[fireIndex]; fireIndex++){
                    if(fn.apply(item[0], item[1]) === false
                        && opts.stopOnFalse){
                        memory = false;
                        break;
                    }
                }
            }
            isFiring = false;
            opts.once && (fnArray = []);
        },
        callbacks = {
            add: function(){
                if(!fnArray){return this;}
                var index = fnArray && fnArray.length;
                (function add(args){
                    var len = args.length,
                        type, item;
                    for(var i = 0, item; i < len; i++){
                        if(!(item = args[i])){continue;}
                        type = ebuy361.type(item);
                        if(type === 'function'){
                            (!opts.unique || !callbacks.has(item)) && fnArray.push(item);
                        }else if(item && item.length && type !== 'string'){
                            add(item);
                        }
                    }
                })(arguments);
                !isFiring && memory && fireCore(memory, index);
                return this;
            },
            
            remove: function(){
                if(!fnArray){return this;}
                var index;
                ebuy361.forEach(arguments, function(item){
                    while((index = ebuy361.array(fnArray).indexOf(item)) > -1){
                        fnArray.splice(index, 1);
                        isFiring && index < fireIndex && fireIndex--;
                    }
                });
                return this;
            },
            
            has: function(fn){
                return ebuy361.array(fnArray).indexOf(fn) > -1;
            },
            
            empty: function(){
                return fnArray = [], this;
            },
            disable: function(){
                return fnArray = fireQueue = memory = undefined, this;
            },
            disabled: function(){
                return !fnArray;
            },
            lock: function(){
                isLocked = true;
                !memory && callbacks.disable();
                return this;
            },
            fired: function(){
                return isFired;
            },
            fireWith: function(context, args){
                if(isFired && opts.once
                    || isLocked){return this;}
                args = args || [];
                args = [context, args.slice ? args.slice() : args];
                fireCore(args);
                return this;
            },
            fire: function(){
                callbacks.fireWith(this, arguments);
                return this;
            }
        };
    return callbacks;
});






































ebuy361.createChain('Deferred', function(fn){
    return new ebuy361.Deferred.$Deferred(fn);
}, function(fn){
    var me = this,
        state = 'pending',
        tuples = [
            ['resolve', 'done', ebuy361.Callbacks('once memory'), 'resolved'],
            ['reject', 'fail', ebuy361.Callbacks('once memory'), 'rejected'],
            ['notify', 'progress', ebuy361.Callbacks('memory')]
        ],
        promise = {
            state: function(){return state;},
            always: function(){
                me.done(arguments).fail(arguments);
                return this;
            },
            then: function(){
                
                var args = arguments;
                return ebuy361.Deferred(function(defer){
                    ebuy361.forEach(tuples, function(item, index){
                        var action = item[0],
                            fn = args[index];
                        me[item[1]](ebuy361.type(fn) === 'function' ? function(){
                            var ret = fn.apply(this, arguments);
                            if(ret && ebuy361.type(ret.promise) === 'function'){
                                ret.promise()
                                    .done(defer.resolve)
                                    .fail(defer.reject)
                                    .progress(defer.notify);
                            }else{
                                defer[action + 'With'](this === me ? defer : this, [ret]);
                            }
                        } : defer[action]);
                    });
                }).promise();
                
            },
            promise: function(instance){
                return instance != null ? ebuy361.extend(instance, promise) : promise;
            }
        };
    //
    promise.pipe = promise.then;
    ebuy361.forEach(tuples, function(item, index){
        var callbacks = item[2],
            stateName = item[3];
        // promise[ done | fail | progress ] = list.add
        promise[item[1]] = callbacks.add;
        stateName && callbacks.add(function(){
            // state = [ resolved | rejected ]
            state = stateName;
            // [ reject_list | resolve_list ].disable; progress_list.lock
        }, tuples[index ^ 1][2].disable, tuples[2][2].lock);
        // deferred[ resolve | reject | notify ] = list.fire
        me[item[0]] = callbacks.fire;
        me[item[0] + 'With'] = callbacks.fireWith;
    });
    promise.promise(me);
    fn && fn.call(me, me);
});





ebuy361.dom.extend({
    ready: function(){

        var me = this,

            // The deferred used on DOM ready
            readyList,

            // Use the correct document accordingly with window argument (sandbox)
            document = window.document;

        // Is the DOM ready to be used? Set to true once it occurs.
        ebuy361._util_.isDomReady = false;

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        ebuy361._util_._readyWait = 1;

        // Hold (or release) the ready event
        ebuy361.dom.holdReady = function( hold ) {
            if ( hold ) {
                ebuy361._util_.readyWait++;
            } else {
                _ready( true );
            }
        };

        // Handle when the DOM is ready
        var _ready = function( wait ) {

            // Abort if there are pending holds or we're already ready
            if ( wait === true ? --ebuy361._util_.readyWait : ebuy361._util_.isDomReady ) {
                return;
            }

            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( !document.body ) {
                return setTimeout( _ready, 1 );
            }

            // Remember that the DOM is ready
            ebuy361._util_.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if ( wait !== true && --ebuy361._util_.readyWait > 0 ) {
                return;
            }

            // If there are functions bound, to execute
            readyList.resolveWith( document );

            // Trigger any bound ready events
            if ( ebuy361.dom.trigger ) {
                ebuy361.dom( document ).trigger("ready").off("ready");
            }
        };

        var DOMContentLoaded = function() {
            if ( document.addEventListener ) {
                document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                _ready();
            } else if ( document.readyState === "complete" ) {
                // we're here because readyState === "complete" in oldIE
                // which is good enough for us to call the dom ready!
                document.detachEvent( "onreadystatechange", DOMContentLoaded );
                _ready();
            }
        };

        var readyPromise = function( obj ) {
            if ( !readyList ) {

                readyList = ebuy361.Deferred();

                // Catch cases where $(document).ready() is called after the browser event has already occurred.
                // we once tried to use readyState "interactive" here, but it caused issues like the one
                // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
                if ( document.readyState === "complete" ) {
                    // Handle it asynchronously to allow scripts the opportunity to delay ready
                    setTimeout( _ready, 1 );

                // Standards-based browsers support DOMContentLoaded
                } else if ( document.addEventListener ) {
                    // Use the handy event callback
                    document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

                    // A fallback to window.onload, that will always work
                    window.addEventListener( "load", _ready, false );

                // If IE event model is used
                } else {
                    // Ensure firing before onload, maybe late but safe also for iframes
                    document.attachEvent( "onreadystatechange", DOMContentLoaded );

                    // A fallback to window.onload, that will always work
                    window.attachEvent( "onload", _ready );

                    // If IE and not a frame
                    // continually check to see if the document is ready
                    var top = false;

                    try {
                        top = window.frameElement == null && document.documentElement;
                    } catch(e) {}

                    if ( top && top.doScroll ) {
                        (function doScrollCheck() {
                            if ( !ebuy361._util_.isDomReady ) {

                                try {
                                    // Use the trick by Diego Perini
                                    // http://javascript.nwbox.com/IEContentLoaded/
                                    top.doScroll("left");
                                } catch(e) {
                                    return setTimeout( doScrollCheck, 50 );
                                }

                                // and execute any waiting functions
                                _ready();
                            }
                        })();
                    }
                }
            }
            return readyList.promise( obj );
        };

        return function( fn ) {

            // Add the callback
            readyPromise().done( fn );

            return me;
        }

    }()
});








ebuy361.dom.extend({
    one: function( types, selector, data, fn  ){
        return this.on( types, selector, data, fn, 1 );
    }
});



ebuy361.dom.extend({
    delegate: function( selector, type, data, fn ){
        if( typeof data == "function" )
            fn = data,
            data = null;
        return this.on( type, selector, data, fn );
    }
});




ebuy361.dom.extend({
    undelegate: function( selector, type, fn ){
        return this.off( type, selector, fn );
    }
});

void function(){
    var arr = ("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave mousewheel " +
    "change select submit keydown keypress keyup error contextmenu").split(" ");

    var conf = {};
    var create = function( name ){
        conf[ name ] = function( data, fn ){
            if( fn == null )
                fn = data,
                data = null;

            return arguments.length > 0 ?
                this.on( name, null, data, fn ) :
                this.trigger( name );
        }
    };

    for(var i = 0, l = arr.length; i < l; i ++)
        create( arr[i] );

    ebuy361.dom.extend( conf );
}();



ebuy361.dom.extend({
    is : function (selector) {
        return ebuy361.dom.match(this, selector).length > 0;
    }
});











ebuy361.dom.extend({
    children : function (selector) {
        var a = [];

        this.each(function(){
            ebuy361.forEach(this.children || this.childNodes, function(dom){
                dom.nodeType == 1 && a.push(dom);
            });
        });

        return this.pushStack( ebuy361.dom.match(a, selector) );
    }
});







ebuy361.dom.extend({
    first : function () {
        return this.eq( 0 );
    }
});







ebuy361.dom.extend({
    last : function () {
        return this.eq( -1 );
    }
});









ebuy361.dom.extend({
    has: function (selector) {
        var a = []
            ,td = ebuy361.dom(document.body);

        ebuy361.forEach(this, function(dom){
            td[0] = dom;
            td.find(selector).length && a.push(dom);
        });

        return ebuy361.dom(a);
    }
});







ebuy361.dom.extend({
    not : function (selector) {
        var i, j, n
            ,all= this.get()
            ,a  = ebuy361.isArray(selector) ? selector
                : ebuy361.dom.match(this, selector);

        for (i=all.length - 1; i>-1; i--) {
            for (j=0, n=a.length; j<n; j++) {
                a[j] === all[i] && all.splice(i, 1);
            }
        }

        return this.pushStack(all);
    }
});






ebuy361.dom.extend({
    slice : function(){
        var slice = Array.prototype.slice;

        return function (start, end) {
            ebuy361.check("number(,number)?","ebuy361.dom.slice");

            // ie bug
            // return ebuy361.dom( this.toArray().slice(start, end) );
            return this.pushStack( slice.apply(this, arguments) );
        }
    }()
});







ebuy361.dom.extend({
    closest : function (selector, context) {
        var results = ebuy361.array();

        ebuy361.forEach ( this, function(dom) {
            var t = [dom];
            while ( dom = dom.parentNode ) {
                dom.nodeType && t.push( dom );
            }
            t = ebuy361.dom.match( t, selector, context );

            t.length && results.push(t[0]);
        });
        
        return this.pushStack( results.unique() );
    }
});







ebuy361.dom.extend({
    next : function (filter) {
        var td = [];

        ebuy361.forEach(this, function(dom){
            while((dom = dom.nextSibling) && dom && dom.nodeType != 1);
            dom && (td[td.length ++] = dom);
        });

        return this.pushStack( filter ? ebuy361.dom.match(td, filter) : td );
    }
});







ebuy361.dom.extend({
    nextAll : function (selector) {
        var array = [];

        ebuy361.forEach(this, function(dom){
            while(dom = dom.nextSibling) {
                dom && (dom.nodeType == 1) && array.push(dom);
            };
        });

        return this.pushStack( ebuy361.dom.match(array, selector) );
    }
});








ebuy361.dom.extend({
    nextUntil : function (selector, filter) {
        var array = ebuy361.array();

        ebuy361.forEach(this, function(dom){
            var a = ebuy361.array();

            while(dom = dom.nextSibling) {
                dom && (dom.nodeType == 1) && a.push(dom);
            };

            if (selector && a.length) {
                var b = ebuy361.dom.match(a, selector);
                // 有符合 selector 的目标存在
                if (b.length) {
                    a = a.slice(0, a.indexOf(b[0]));
                }
            }
            ebuy361.merge(array, a);
        });

        return this.pushStack( ebuy361.dom.match(array, filter) );
    }
});







ebuy361.dom.extend({
    parent : function (filter) {
        var array = [];

        ebuy361.forEach(this, function(dom) {
            (dom = dom.parentNode) && dom.nodeType == 1 && array.push(dom);
        });

        return this.pushStack( ebuy361.dom.match(array, filter) );
    }
});








ebuy361.dom.extend({
    parents : function (filter) {
        var array = [];

        ebuy361.forEach(this, function(dom) {
            var a = [];

            while ((dom = dom.parentNode) && dom.nodeType == 1) a.push(dom);

            ebuy361.merge(array, a);
        });

        return this.pushStack( ebuy361.dom.match(array, filter) );
    }
});








ebuy361.dom.extend({
    parentsUntil : function (selector, filter) {
        ebuy361.check("(string|HTMLElement)(,.+)?","ebuy361.dom.parentsUntil");
        var array = [];

        ebuy361.forEach(this, function(dom){
            var a = ebuy361.array();

            while ((dom = dom.parentNode) && dom.nodeType == 1) a.push(dom);

            if (selector && a.length) {
                var b = ebuy361.dom.match(a, selector);
                // 有符合 selector 的目标存在
                if (b.length) {
                    a = a.slice(0, a.indexOf(b[0]));
                }
            }
            ebuy361.merge(array, a);
        });

        return this.pushStack( ebuy361.dom.match(array, filter) );
    }
});







ebuy361.dom.extend({
    prev : function (filter) {
        var array = [];

        ebuy361.forEach(this, function(dom) {
            while (dom = dom.previousSibling) {
                if (dom.nodeType == 1) {
                    array.push(dom);
                    break;
                }
            }
        });

        return this.pushStack( ebuy361.dom.match(array, filter) );
    }
});









ebuy361.dom.extend({
    prevAll : function (filter) {
        var array = ebuy361.array();

        ebuy361.forEach(this, function(dom) {
            var a = [];
            while (dom = dom.previousSibling) dom.nodeType == 1 && a.push(dom);

            ebuy361.merge(array, a.reverse());
        });

        return this.pushStack(typeof filter == "string" ? ebuy361.dom.match(array, filter) : array.unique());
    }
});








ebuy361.dom.extend({
    prevUntil : function (selector, filter) {
        ebuy361.check("(string|HTMLElement)(,.+)?", "ebuy361.dom.prevUntil");
        var array = [];

        ebuy361.forEach(this, function(dom) {
            var a = ebuy361.array();

            while(dom = dom.previousSibling) {
                dom && (dom.nodeType == 1) && a.push(dom);
            };

            if (selector && a.length) {
                var b = ebuy361.dom.match(a, selector);
                // 有符合 selector 的目标存在
                if (b.length) {
                    a = a.slice(0, a.indexOf(b[0]));
                }
            }

            ebuy361.merge(array, a);
        });

        return this.pushStack( ebuy361.dom.match(array, filter) );
    }
});







ebuy361.dom.extend({
    siblings : function (filter) {
        var array = [];

        ebuy361.forEach(this, function(dom){
            var p = [], n = [], t = dom;

            while(t = t.previousSibling) t.nodeType == 1 && p.push(t);
            while(dom = dom.nextSibling) dom.nodeType==1 && n.push(dom);

            ebuy361.merge(array, p.reverse().concat(n));
        });

        return this.pushStack( ebuy361.dom.match(array, filter) );
    }
});













ebuy361.dom.extend({
    add : function (object, context) {
        var a = ebuy361.array(this.get());

        switch (ebuy361.type(object)) {
            case "HTMLElement" :
                a.push(object);
                break;

            case "$DOM" :
            case "array" :
                ebuy361.merge(a, object)
                break;

            // HTMLString or selector
            case "string" :
                ebuy361.merge(a, ebuy361.dom(object, context));
                break;
            // [TODO] case "NodeList" :
            default :
                if (typeof object == "object" && object.length) {
                    ebuy361.merge(a, object)
                }
        }
        return this.pushStack( a.unique() );
    }
});

// meizz 20120601 add方法可以完全使用 ebuy361.merge(this, ebuy361.dom(object, context)) 这一句代码完成所有功能，但为节约内存和提高效率的原因，将几个常用分支单独处理了



ebuy361.dom.extend({
    contents: function(){
        var ret = [], nodeName;
        for(var i = 0, ele; ele = this[i]; i++){
            nodeName = ele.nodeName;
            ret.push.apply(ret, ebuy361.makeArray(nodeName && nodeName.toLowerCase() === 'iframe' ?
                ele.contentDocument || ele.contentWindow.document
                    : ele.childNodes));
        }
        return this.pushStack(ret);
    }
});



ebuy361.platform = ebuy361.platform || function(){
    var ua = navigator.userAgent,
        result = function(){};

    ebuy361.forEach("Android iPad iPhone Linux Macintosh Windows X11".split(" "), function(item ) {
        var key = item.charAt(0).toUpperCase() + item.toLowerCase().substr( 1 );
        ebuy361[ "is" + key ] = result[ "is" + key ] = !!~ua.indexOf( item );//) && (result = item);
    });

    return result;
}();


//ebuy361.platform.isAndroid = /android/i.test(navigator.userAgent);


//ebuy361.platform.isIpad = /ipad/i.test(navigator.userAgent);


//ebuy361.platform.isIphone = /iphone/i.test(navigator.userAgent);


//ebuy361.platform.isMacintosh = /macintosh/i.test(navigator.userAgent);


 
//ebuy361.platform.isWindows = /windows/i.test(navigator.userAgent);


//ebuy361.platform.isX11 = /x11/i.test(navigator.userAgent);


//ebuy361.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);


//ebuy361.browser.isWebkit = /webkit/i.test(navigator.userAgent);


//ebuy361.browser.chrome = /chrome\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined;


//ebuy361.browser.firefox = /firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined;

//IE 8下，以documentMode为准
//在百度模板中，可能会有$，防止冲突，将$1 写成 \x241

//ebuy361.browser.ie = ebuy361.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;

//try {
//    if (/(\d+\.\d+)/.test(external.max_version)) {

//        ebuy361.browser.maxthon = + RegExp['\x241'];
//    }
//} catch (e) {}

//(function(){
//    var ua = navigator.userAgent;
    
    
    
//    ebuy361.browser.safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp['\x241'] || RegExp['\x242']) : undefined;
//})();



ebuy361.createChain('number', function(number){
    var nan = parseFloat(number),
        val = isNaN(nan) ? nan : number,
        clazz = typeof val === 'number' ? Number : String,
        pro = clazz.prototype;
    val = new clazz(val);
    ebuy361.forEach(ebuy361.number.$Number.prototype, function(value, key){
        pro[key] || (val[key] = value);
    });
    return val;
});





ebuy361.number.extend({
    comma : function (length) {
        var source = this;
        if (!length || length < 1) {
            length = 3;
        }
    
        source = String(source).split(".");
        source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{'+length+'})+$)','ig'),"$1,");
        return source.join(".");
    }    
});







ebuy361.number.extend({
    pad : function (length) {
        var source = this;
        var pre = "",
            negative = (source < 0),
            string = String(Math.abs(source));
    
        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }
    
        return (negative ?  "-" : "") + pre + string;
    }
});



ebuy361.number.randomInt = function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
};





ebuy361.string.extend({
    decodeHTML : function () {
        var str = this
                    .replace(/&quot;/g,'"')
                    .replace(/&lt;/g,'<')
                    .replace(/&gt;/g,'>')
                    .replace(/&amp;/g, "&");
        //处理转义的中文和实体字符
        return str.replace(/&#([\d]+);/g, function(_0, _1){
            return String.fromCharCode(parseInt(_1, 10));
        });
    }
});






ebuy361.string.extend({
    encodeHTML : function () {
        return this.replace(/&/g,'&amp;')
                    .replace(/</g,'&lt;')
                    .replace(/>/g,'&gt;')
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");
    }
});





ebuy361.string.extend({
    escapeReg : function () {
        return this.replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241');
    }
});









//format(a,a,d,f,c,d,g,c);
ebuy361.string.extend({
    format : function (opts) {
        var source = this.valueOf(),
            data = Array.prototype.slice.call(arguments,0), toString = Object.prototype.toString;
        if(data.length){
            data = data.length == 1 ? 
                
                (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
                : data;
            return source.replace(/#\{(.+?)\}/g, function (match, key){
                var replacer = data[key];
                // chrome 下 typeof /a/ == 'function'
                if('[object Function]' == toString.call(replacer)){
                    replacer = replacer(key);
                }
                return ('undefined' == typeof replacer ? '' : replacer);
            });
        }
        return source;
    }
});







ebuy361.string.extend({
    formatColor: function(){
        // 将正则表达式预创建，可提高效率
        var reg1 = /^\#[\da-f]{6}$/i,
            reg2 = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i,
            keyword = {
                black: '#000000',
                silver: '#c0c0c0',
                gray: '#808080',
                white: '#ffffff',
                maroon: '#800000',
                red: '#ff0000',
                purple: '#800080',
                fuchsia: '#ff00ff',
                green: '#008000',
                lime: '#00ff00',
                olive: '#808000',
                yellow: '#ffff0',
                navy: '#000080',
                blue: '#0000ff',
                teal: '#008080',
                aqua: '#00ffff'
            };
            
        return function(){
            var color = this.valueOf();
            if(reg1.test(color)) {
                // #RRGGBB 直接返回
                return color;
            } else if(reg2.test(color)) {
                // 非IE中的 rgb(0, 0, 0)
                for (var s, i=1, color="#"; i<4; i++) {
                    s = parseInt(RegExp["\x24"+ i]).toString(16);
                    color += ("00"+ s).substr(s.length);
                }
                return color;
            } else if(/^\#[\da-f]{3}$/.test(color)) {
                // 简写的颜色值: #F00
                var s1 = color.charAt(1),
                    s2 = color.charAt(2),
                    s3 = color.charAt(3);
                return "#"+ s1 + s1 + s2 + s2 + s3 + s3;
            }else if(keyword[color])
                return keyword[color];
            
            return '';
        }
    }()
});




ebuy361.string.extend({
    stripTags : function() {
        return (this || '').replace(/<[^>]+>/g, '');
    }
});




ebuy361.string.extend({
    getByteLength : function () {
        return this.replace(/[^\x00-\xff]/g, 'ci').length;
    }
    //获取字符在gbk编码下的字节长度, 实现原理是认为大于127的就一定是双字节。如果字符超出gbk编码范围, 则这个计算不准确
});




ebuy361.string.extend({
    subByte : function (len, tail) {
        ebuy361.check('number(,string)?$', 'ebuy361.string.subByte');

        if(len < 0 || this.getByteLength() <= len){
            return this.valueOf(); // 20121109 mz 去掉tail
        }
        //thanks 加宽提供优化方法
        var source = this.substr(0, len)
            .replace(/([^\x00-\xff])/g,"\x241 ")//双字节字符替换成两个
            .substr(0, len)//截取长度
            .replace(/[^\x00-\xff]$/,"")//去掉临界双字节字符
            .replace(/([^\x00-\xff]) /g,"\x241");//还原
        return source + (tail || "");
    }
});






ebuy361.string.extend({
    toHalfWidth : function () {
        return this.replace(/[\uFF01-\uFF5E]/g,
            function(c){
                return String.fromCharCode(c.charCodeAt(0) - 65248);
            }).replace(/\u3000/g," ");
    }
});






ebuy361.string.extend({
    wbr : function () {
        return this.replace(/(?:<[^>]+>)|(?:&#?[0-9a-z]{2,6};)|(.{1})/gi, '$&<wbr>')
            .replace(/><wbr>/g, '>');
    }
});






ebuy361.array.extend({
    contains : function (item) {
        return !!~this.indexOf(item);
    }
});







ebuy361.array.extend({
    each: function(iterator, context){
        return ebuy361.each(this, iterator, context);
    },
    
    forEach: function(iterator, context){
        return ebuy361.forEach(this, iterator, context);
    }
});








ebuy361.array.extend({
    empty : function () {
        this.length = 0;
        return this;
    }
});












ebuy361.array.extend({
    filter: function(iterator, context) {
        var result = ebuy361.array([]),
            i, n, item, index=0;
    
        if (ebuy361.type(iterator) === "function") {
            for (i=0, n=this.length; i<n; i++) {
                item = this[i];
    
                if (iterator.call(context || this, item, i, this) === true) {
                    result[index ++] = item;
                }
            }
        }
        return result;
    }
});








ebuy361.array.extend({
    find : function (iterator) {
        var i, item, n=this.length;

        if (ebuy361.type(iterator) == "function") {
            for (i=0; i<n; i++) {
                item = this[i];
                if (iterator.call(this, item, i, this) === true) {
                    return item;
                }
            }
        }

        return null;
    }
});






ebuy361.array.extend({
    hash : function (values) {
        var result = {},
            vl = values && values.length,
            i, n;

        for (i=0, n=this.length; i < n; i++) {
            result[this[i]] = (vl && vl > i) ? values[i] : true;
        }
        return result;
    }
});






ebuy361.array.extend({
    lastIndexOf : function (match, fromIndex) {
        ebuy361.check(".+(,number)?", "ebuy361.array.lastIndexOf");
        var len = this.length;

        (!(fromIndex = fromIndex | 0) || fromIndex >= len) && (fromIndex = len - 1);
        fromIndex < 0 && (fromIndex += len);

        for(; fromIndex >= 0; fromIndex --){
            if(fromIndex in this && this[fromIndex] === match){
                return fromIndex;
            }
        }
        
        return -1;
    }
});






ebuy361.array.extend({
    remove : function (match) {
        var n = this.length;
            
        while (n--) {
            if (this[n] === match) {
                this.splice(n, 1);
            }
        }
        return this;
    }
});






ebuy361.array.extend({
    removeAt : function (index) {
        ebuy361.check("number", "ebuy361.array.removeAt");
        return this.splice(index, 1)[0];
    }
});

ebuy361.object = ebuy361.object || {};




//ebuy361.lang.isArray = function (source) {
//    return '[object Array]' == Object.prototype.toString.call(source);
//};
ebuy361.lang.isArray = ebuy361.isArray;




ebuy361.object.isPlain  = ebuy361.isPlainObject;


ebuy361.object.clone  = function (source) {
    var result = source, i, len;
    if (!source
        || source instanceof Number
        || source instanceof String
        || source instanceof Boolean) {
        return result;
    } else if (ebuy361.lang.isArray(source)) {
        result = [];
        var resultLen = 0;
        for (i = 0, len = source.length; i < len; i++) {
            result[resultLen++] = ebuy361.object.clone(source[i]);
        }
    } else if (ebuy361.object.isPlain(source)) {
        result = {};
        for (i in source) {
            if (source.hasOwnProperty(i)) {
                result[i] = ebuy361.object.clone(source[i]);
            }
        }
    }
    return result;
};


ebuy361.object.each = function (source, iterator) {
    var returnValue, key, item; 
    if ('function' == typeof iterator) {
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                item = source[key];
                returnValue = iterator.call(source, item, key);
        
                if (returnValue === false) {
                    break;
                }
            }
        }
    }
    return source;
};



//ebuy361.object.extend = function (target, source) {
//    for (var p in source) {
//        if (source.hasOwnProperty(p)) {
//            target[p] = source[p];
//        }
//    }
//    
//    return target;
//};
ebuy361.object.extend = ebuy361.extend;


ebuy361.object.isEmpty = function(obj) {
    var ret = true;
    if('[object Array]' === Object.prototype.toString.call(obj)){
        ret = !obj.length;
    }else{
        obj = new Object(obj);
        for(var key in obj){
            return false;
        }
    }
    return ret;
};


ebuy361.object.keys = function (source) {
    var result = [], resultLen = 0, k;
    for (k in source) {
        if (source.hasOwnProperty(k)) {
            result[resultLen++] = k;
        }
    }
    return result;
};


ebuy361.object.map = function (source, iterator) {
    var results = {};
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            results[key] = iterator(source[key], key);
        }
    }
    return results;
};




//ebuy361.lang.isObject = function (source) {
//    return 'function' == typeof source || !!(source && 'object' == typeof source);
//};
ebuy361.lang.isObject = ebuy361.isObject;




//ebuy361.lang.isFunction = function (source) {
    // chrome下,'function' == typeof /a/ 为true.
//    return '[object Function]' == Object.prototype.toString.call(source);
//};
ebuy361.lang.isFunction = ebuy361.isFunction;



ebuy361.object.merge = function(){
    function isPlainObject(source) {
        return ebuy361.lang.isObject(source) && !ebuy361.lang.isFunction(source);
    };
    function mergeItem(target, source, index, overwrite, recursive) {
        if (source.hasOwnProperty(index)) {
            if (recursive && isPlainObject(target[index])) {
                // 如果需要递归覆盖，就递归调用merge
                ebuy361.object.merge(
                    target[index],
                    source[index],
                    {
                        'overwrite': overwrite,
                        'recursive': recursive
                    }
                );
            } else if (overwrite || !(index in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                target[index] = source[index];
            }
        }
    };
    
    return function(target, source, opt_options){
        var i = 0,
            options = opt_options || {},
            overwrite = options['overwrite'],
            whiteList = options['whiteList'],
            recursive = options['recursive'],
            len;
    
        // 只处理在白名单中的属性
        if (whiteList && whiteList.length) {
            len = whiteList.length;
            for (; i < len; ++i) {
                mergeItem(target, source, whiteList[i], overwrite, recursive);
            }
        } else {
            for (i in source) {
                mergeItem(target, source, i, overwrite, recursive);
            }
        }
        return target;
    };
}();


ebuy361.object.values = function (source) {
    var result = [], resultLen = 0, k;
    for (k in source) {
        if (source.hasOwnProperty(k)) {
            result[resultLen++] = source[k];
        }
    }
    return result;
};

ebuy361.date = ebuy361.date || {};





ebuy361.date.format = function (source, pattern) {
    if ('string' != typeof pattern) {
        return source.toString();
    }

    function replacer(patternPart, result) {
        pattern = pattern.replace(patternPart, result);
    }
    
    var pad     = ebuy361.number.pad,
        year    = source.getFullYear(),
        month   = source.getMonth() + 1,
        date2   = source.getDate(),
        hours   = source.getHours(),
        minutes = source.getMinutes(),
        seconds = source.getSeconds();

    replacer(/yyyy/g, pad(year, 4));
    replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
    replacer(/MM/g, pad(month, 2));
    replacer(/M/g, month);
    replacer(/dd/g, pad(date2, 2));
    replacer(/d/g, date2);

    replacer(/HH/g, pad(hours, 2));
    replacer(/H/g, hours);
    replacer(/hh/g, pad(hours % 12, 2));
    replacer(/h/g, hours % 12);
    replacer(/mm/g, pad(minutes, 2));
    replacer(/m/g, minutes);
    replacer(/ss/g, pad(seconds, 2));
    replacer(/s/g, seconds);

    return pattern;
};



ebuy361.date.parse = function (source) {
    var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
    if ('string' == typeof source) {
        if (reg.test(source) || isNaN(Date.parse(source))) {
            var d = source.split(/ |T/),
                d1 = d.length > 1 
                        ? d[1].split(/[^\d]/) 
                        : [0, 0, 0],
                d0 = d[0].split(/[^\d]/);
            return new Date(d0[0] - 0, 
                            d0[1] - 1, 
                            d0[2] - 0, 
                            d1[0] - 0, 
                            d1[1] - 0, 
                            d1[2] - 0);
        } else {
            return new Date(source);
        }
    }
    
    return new Date();
};




ebuy361.createChain("fn",

// 执行方法
function(fn){
    return new ebuy361.fn.$Fn(~'function|string'.indexOf(ebuy361.type(fn)) ? fn : function(){});
},

// constructor
function(fn){
    this.fn = fn;
});


ebuy361.fn.extend({
    bind: function(scope){
        var func = this.fn,
            xargs = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : null;
        return function(){
            var fn = ebuy361.type(func) === 'string' ? scope[func] : func,
                args = xargs ? xargs.concat(Array.prototype.slice.call(arguments, 0)) : arguments;
            return fn.apply(scope || fn, args);
        }
    }
});




ebuy361.fn.blank = function () {};

ebuy361.json = ebuy361.json || {};


ebuy361.json.parse = function (data) {
    //2010/12/09：更新至不使用原生parse，不检测用户输入是否正确
    return (new Function("return (" + data + ")"))();
};



ebuy361.json.stringify = (function () {
    
    var escapeMap = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"' : '\\"',
        "\\": '\\\\'
    };
    
    
    function encodeString(source) {
        if (/["\\\x00-\x1f]/.test(source)) {
            source = source.replace(
                /["\\\x00-\x1f]/g, 
                function (match) {
                    var c = escapeMap[match];
                    if (c) {
                        return c;
                    }
                    c = match.charCodeAt();
                    return "\\u00" 
                            + Math.floor(c / 16).toString(16) 
                            + (c % 16).toString(16);
                });
        }
        return '"' + source + '"';
    }
    
    
    function encodeArray(source) {
        var result = ["["], 
            l = source.length,
            preComma, i, item;
            
        for (i = 0; i < l; i++) {
            item = source[i];
            
            switch (typeof item) {
            case "undefined":
            case "function":
            case "unknown":
                break;
            default:
                if(preComma) {
                    result.push(',');
                }
                result.push(ebuy361.json.stringify(item));
                preComma = 1;
            }
        }
        result.push("]");
        return result.join("");
    }
    
    
    function pad(source) {
        return source < 10 ? '0' + source : source;
    }
    
    
    function encodeDate(source){
        return '"' + source.getFullYear() + "-" 
                + pad(source.getMonth() + 1) + "-" 
                + pad(source.getDate()) + "T" 
                + pad(source.getHours()) + ":" 
                + pad(source.getMinutes()) + ":" 
                + pad(source.getSeconds()) + '"';
    }
    
    return function (value) {
        switch (typeof value) {
        case 'undefined':
            return 'undefined';
            
        case 'number':
            return isFinite(value) ? String(value) : "null";
            
        case 'string':
            return encodeString(value);
            
        case 'boolean':
            return String(value);
            
        default:
            if (value === null) {
                return 'null';
            } else if (ebuy361.type(value) === 'array') {
                return encodeArray(value);
            } else if (ebuy361.type(value) === 'date') {
                return encodeDate(value);
            } else {
                var result = ['{'],
                    encode = ebuy361.json.stringify,
                    preComma,
                    item;
                    
                for (var key in value) {
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        item = value[key];
                        switch (typeof item) {
                        case 'undefined':
                        case 'unknown':
                        case 'function':
                            break;
                        default:
                            if (preComma) {
                                result.push(',');
                            }
                            preComma = 1;
                            result.push(encode(key) + ':' + encode(item));
                        }
                    }
                }
                result.push('}');
                return result.join('');
            }
        }
    };
})();

ebuy361.cookie = ebuy361.cookie || {};


ebuy361.cookie._isValidKey = function (key) {
    // http://www.w3.org/Protocols/rfc2109/rfc2109
    // Syntax:  General
    // The two state management headers, Set-Cookie and Cookie, have common
    // syntactic properties involving attribute-value pairs.  The following
    // grammar uses the notation, and tokens DIGIT (decimal digits) and
    // token (informally, a sequence of non-special, non-white space
    // characters) from the HTTP/1.1 specification [RFC 2068] to describe
    // their syntax.
    // av-pairs   = av-pair *(";" av-pair)
    // av-pair    = attr ["=" value] ; optional value
    // attr       = token
    // value      = word
    // word       = token | quoted-string
    
    // http://www.ietf.org/rfc/rfc2068.txt
    // token      = 1*<any CHAR except CTLs or tspecials>
    // CHAR       = <any US-ASCII character (octets 0 - 127)>
    // CTL        = <any US-ASCII control character
    //              (octets 0 - 31) and DEL (127)>
    // tspecials  = "(" | ")" | "<" | ">" | "@"
    //              | "," | ";" | ":" | "\" | <">
    //              | "/" | "[" | "]" | "?" | "="
    //              | "{" | "}" | SP | HT
    // SP         = <US-ASCII SP, space (32)>
    // HT         = <US-ASCII HT, horizontal-tab (9)>
        
    return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
};


ebuy361.cookie.getRaw = function (key) {
    if (ebuy361.cookie._isValidKey(key)) {
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
            result = reg.exec(document.cookie);
            
        if (result) {
            return result[2] || null;
        }
    }

    return null;
};


 
ebuy361.cookie.get = function (key) {
    var value = ebuy361.cookie.getRaw(key);
    if ('string' == typeof value) {
        value = decodeURIComponent(value);
        return value;
    }
    return null;
};




ebuy361.cookie.setRaw = function (key, value, options) {
    if (!ebuy361.cookie._isValidKey(key)) {
        return;
    }
    
    options = options || {};
    //options.path = options.path || "/"; // meizz 20100402 设定一个初始值，方便后续的操作
    //berg 20100409 去掉，因为用户希望默认的path是当前路径，这样和浏览器对cookie的定义也是一致的
    
    // 计算cookie过期时间
    var expires = options.expires;
    if ('number' == typeof options.expires) {
        expires = new Date();
        expires.setTime(expires.getTime() + options.expires);
    }
    
    document.cookie =
        key + "=" + value
        + (options.path ? "; path=" + options.path : "")
        + (expires ? "; expires=" + expires.toGMTString() : "")
        + (options.domain ? "; domain=" + options.domain : "")
        + (options.secure ? "; secure" : ''); 
};




ebuy361.cookie.set = function (key, value, options) {
    ebuy361.cookie.setRaw(key, encodeURIComponent(value), options);
};


ebuy361.cookie.remove = function (key, options) {
    options = options || {};
    options.expires = new Date(0);
    ebuy361.cookie.setRaw(key, '', options);
};








ebuy361.when = ebuy361.when || function(subordinate ){
    var args = arguments,
        len = arguments.length,
        remaining = len !== 1 || (subordinate && ebuy361.type(subordinate.promise) === 'function') ? len : 0,
        defer = remaining === 1 ? subordinate : ebuy361.Deferred(),
        progressVals, progressContexts, resolveContexts;
    function update(index, contexts, vals){
        return function(val){
            contexts[index] = this;
            vals[index] = arguments.length > 1 ? arguments : val;
            if(vals === progressVals){
                defer.notifyWith(contexts, vals);
            }else if(!(--remaining)){
                defer.resolveWith(contexts, vals);
            }
        };
    }
    
    if(len > 1){
        progressVals = new Array(len);
        progressContexts = new Array(len);
        resolveContexts = new Array(len);
        for(var i = 0; i < len; i++){
            if(args[i] && ebuy361.type(args[i].promise) === 'function'){
                args[i].promise()
                    .done(update(i, resolveContexts, args))
                    .fail(defer.reject)
                    .progress(update(i, progressContexts, progressVals));
            }else{
                --remaining;
            }
        }
        
    }
    !remaining && defer.resolveWith(resolveContexts, args);
    return defer.promise();
}





 

 



void function(){
    var ajaxLocation = document.URL,
        rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        rprotocol = /^\/\//,
        rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        rhash = /#.*$/,
        rbracket = /\[\]$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rts = /([?&])_=[^&]*/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
        
        // JSON RegExp
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,
        
        
        
        allTypes = ['*/'] + ['*'],
        
        prefilters = {},
        transports = {},
        
        lastModified = {},
        etag = {},
        
        
        
        ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];
        
    function parseXML(data){
        var xml, tmp;
        if (!data || ebuy361.type(data) !== 'string') {
            return null;
        }
        try {
            if ( window.DOMParser ) { // Standard
                tmp = new DOMParser();
                xml = tmp.parseFromString( data , "text/xml" );
            } else { // IE
                xml = new ActiveXObject( "Microsoft.XMLDOM" );
                xml.async = "false";
                xml.loadXML( data );
            }
        } catch( e ) {
            xml = undefined;
        }
        if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
            throw new Error( "Invalid XML: " + data );
        }
        return xml;
    }
    
    function parseJSON(data){
        if(!data || ebuy361.type(data) !== 'string'){return null;}
        data = ebuy361.string(data).trim();
        if ( window.JSON && window.JSON.parse ) {
            return window.JSON.parse( data );
        }
        if ( rvalidchars.test( data.replace( rvalidescape, "@" )
            .replace( rvalidtokens, ']')
            .replace( rvalidbraces, ''))) {

            return ( new Function( 'return ' + data ) )();

        }
        throw new Error( "Invalid JSON: " + data );
    }
    
    function globalEval( data ) {
        if ( data && /\S/.test( data ) ) {
            ( window.execScript || function( data ) {
                window[ "eval" ].call( window, data );
            } )( data );
        }
    }
    
    function toPrefiltersOrTransports(structure){
        return function(expression, func){
            if(ebuy361.type(expression) !== 'string'){
                func = expression;
                expression = '*';
            }
            var dataTypes = expression.toLowerCase().split(/\s+/),
                placeBefore, array;
            
            if(ebuy361.type(func) === 'function'){
                for(var i = 0, item; item = dataTypes[i]; i++){
                    placeBefore = /^\+/.test(item);
                    placeBefore && (item = item.substr(1) || '*');
                    array = structure[item] = structure[item] || [];
                    array[placeBefore ? 'unshift' : 'push'](func);
                }
            }
        };
    }
    
    
    function ajaxHandleResponses(opts, tangXHR, responses){
        var ct, type, finalDataType, firstDataType,
            contents = opts.contents,
            dataTypes = opts.dataTypes,
            responseFields = opts.responseFields;
        
        for ( type in responseFields ) {
            if ( type in responses ) {
                tangXHR[responseFields[type]] = responses[ type ];
            }
        }
        while(dataTypes[0] === '*'){
            dataTypes.shift();
            if (ct === undefined){
                ct = opts.mimeType || tangXHR.getResponseHeader('content-type');
            }
        }
        if(ct){
            for(type in contents ){
                if(contents[type] && contents[type].test(ct)){
                    dataTypes.unshift(type);
                    break;
                }
            }
        }
        if (dataTypes[0] in responses){
            finalDataType = dataTypes[0];
        } else {
            for (type in responses){
                if (!dataTypes[0] || opts.converters[type + ' ' + dataTypes[0]]){
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            finalDataType = finalDataType || firstDataType;
        }
        if(finalDataType){
            if(finalDataType !== dataTypes[0]){
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }
    
    function ajaxConvert(opts, response){
        var dataTypes = opts.dataTypes.slice(),
            prev = dataTypes[0],
            converters = {},
            conv, array;
            
            
            
        opts.dataFilter && (response = opts.dataFilter(response, opts.dataType));
        if(dataTypes[1]){
            for(var i in opts.converters){
                converters[i.toLowerCase()] = opts.converters[i];
            }
        }
        for(var i = 0, curr; curr = dataTypes[++i];){
            if(curr !== '*'){
                if(prev !== '*' && prev !== curr){
                    conv = converters[prev + ' ' + curr] || converters['* ' + curr];
                    if(!conv){
                        for(var key in converters){
                            array = key.split(' ');
                            if(array[1] === curr){
                                conv = converters[prev + ' ' + array[0]]
                                    || converters['* ' + array[0]];
                                if(conv){
                                    if(conv === true){
                                        conv = converters[key];
                                    }else if(converters[key] !== true){
                                        curr = array[0];
                                        dataTypes.splice(i--, 0, curr);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    
                    if(conv !== true){
                        if(conv && opts['throws']){
                            response = conv(response);
                        }else{
                            try{
                                response = conv(response);
                            }catch(e){
                                return { state: 'parsererror', error: conv ? e : 'No conversion from ' + prev + ' to ' + curr };
                            }
                        }
                    }
                }
                prev = curr;
            }
        }
        return { state: 'success', data: response };
    }
    
    
    function inspectPrefiltersOrTransports(structure, options, originalOptions, tangXHR, dataType, inspected){
        dataType = dataType || options.dataTypes[0];
        inspected = inspected || {};
        inspected[dataType] = true;
        
        var selection,
        list = structure[ dataType ],
        length = list ? list.length : 0,
        executeOnly = ( structure === prefilters );
        
        for (var i = 0; i < length && ( executeOnly || !selection ); i++ ) {
            selection = list[ i ]( options, originalOptions, tangXHR );
            if ( typeof selection === "string" ) {
                if ( !executeOnly || inspected[selection]){
                    selection = undefined;
                } else {
                    options.dataTypes.unshift(selection);
                    selection = inspectPrefiltersOrTransports(
                            structure, options, originalOptions, tangXHR, selection, inspected );
                }
            }
        }
        if ( ( executeOnly || !selection ) && !inspected['*'] ) {
            selection = inspectPrefiltersOrTransports(
                    structure, options, originalOptions, tangXHR, '*', inspected );
        }
        return selection;
    }
    
    ebuy361.createChain('ajax', function(url, options){
        if(ebuy361.object.isPlain(url)){
            options = url;
            url = undefined;
        }
        options = options || {};
        
        var opts = ebuy361.ajax.setup({}, options),
            callbackContext = opts.context || opts,
            fireGlobals,
            ifModifiedKey,
            parts,
            
            //tangXHR
            
            deferred = ebuy361.Deferred(),
            completeDeferred = ebuy361.Callbacks('once memory'),
            statusCode = opts.statusCode || {},
            
            state = 0,
            requestHeadersNames = {},
            requestHeaders = {},
            strAbort = 'canceled',
            responseHeadersString,
            responseHeaders,
            transport,
            //tangXHR
            //done
            
            //done
            tangXHR = ebuy361.extend(new ebuy361.ajax.$Ajax(url, opts), {
                readyState: 0,
                setRequestHeader: function(name, value){
                    if(!state){
                        var lname = name.toLowerCase();
                        name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                        requestHeaders[ name ] = value;
                    }
                },
                getAllResponseHeaders: function(){
                    return state === 2 ? responseHeadersString : null;
                },
                
                getResponseHeader: function(key){
                    var match;
                    if(state === 2){
                        if(!responseHeaders){
                            responseHeaders = {};
                            while(match = rheaders.exec(responseHeadersString)){
                                responseHeaders[match[1].toLowerCase()] = match[2];
                            }
                        }
                        match = responseHeaders[key.toLowerCase()];
                    }
                    return match === undefined ? null : match;
                },
                
                overrideMimeType: function(type){
                    !state && (opts.mimeType = type);
                    return this;
                },
                
                abort: function(statusText){
                    statusText = statusText || strAbort;
                    transport && transport.abort(statusText);
                    done(0, statusText);
                    return this;
                }
            });
        var timeoutTimer;
        
        
        function done(status, nativeStatusText, responses, headers){
            var statusText = nativeStatusText,
                isSuccess, success, error, response, modified;
            if(state === 2){return;}
            state = 2;
            timeoutTimer && clearTimeout(timeoutTimer);
            transport = undefined;
            responseHeadersString = headers || '';
            tangXHR.readyState = status > 0 ? 4 : 0;
            responses && (response = ajaxHandleResponses(opts, tangXHR, responses));
            
            if(status >= 200 && status < 300 || status === 304){
                if(opts.ifModified){
                    modified = tangXHR.getResponseHeader('Last-Modified');
                    modified && (lastModified[ifModifiedKey] = modified);
                    modified = tangXHR.getResponseHeader('Etag');
                    modified && (etag[ifModifiedKey] = modified);
                }
                if(status === 304){
                    statusText = 'notmodified';
                    isSuccess = true;
                }else{
                    isSuccess = ajaxConvert(opts, response);
                    statusText = isSuccess.state;
                    success = isSuccess.data;
                    error = isSuccess.error;
                    isSuccess = !error;
                }
            }else{
                error = statusText;
                if(!statusText || status){
                    statusText = 'error';
                    status < 0 && (status = 0);
                }
            }
            
            tangXHR.status = status;
            tangXHR.statusText = '' + (nativeStatusText || statusText);
            
            if(isSuccess){
                deferred.resolveWith(callbackContext, [success, statusText, tangXHR]);
            }else{
                deferred.rejectWith(callbackContext, [tangXHR, statusText, error]);
            }
            tangXHR.statusCode(statusCode);
            statusCode = undefined;
            
//            fireGlobals && globalEventContext.trigger('ajax' + (isSuccess ? 'Success' : 'Error'),
//                        [tangXHR, opts, isSuccess ? success : error]);
            completeDeferred.fireWith(callbackContext, [tangXHR, statusText]);
            //TODO ajaxComplete event;
        }
        
        deferred.promise(tangXHR);
        tangXHR.success = tangXHR.done;
        tangXHR.error = tangXHR.fail;
        tangXHR.complete = completeDeferred.add;
        
        tangXHR.statusCode = function(map){
            if(map){
                if(state < 2){
                    for(var i in map){
                        statusCode[i] = [statusCode[i], map[i]];
                    }
                }else{
                    tangXHR.always(map[tangXHR.status]);
                }
            }
            return this;
        };
        
        //if url is window.location must + ''
        opts.url = ((url || opts.url) + '').replace(rhash, '').replace(rprotocol, ajaxLocParts[1] + '//');
        opts.dataTypes = ebuy361.string(opts.dataType || '*').trim().toLowerCase().split(/\s+/);
        // Determine if a cross-domain request is in order
        if (opts.crossDomain == null){
            parts = rurl.exec(opts.url.toLowerCase());
            opts.crossDomain = !!(parts && (parts[1] != ajaxLocParts[1] || parts[2] != ajaxLocParts[2]
                || (parts[3] || (parts[1] === 'http:' ? 80 : 443)) !=
                    (ajaxLocParts[3] || (ajaxLocParts[1] === 'http:' ? 80 : 443))));
        }
        if(opts.data && opts.processData && ebuy361.type(opts.data) !== 'string'){
            opts.data = ebuy361.ajax.param(opts.data, opts.traditional );
        }
        
        inspectPrefiltersOrTransports(prefilters, opts, options, tangXHR);//运行prefilter()
        
        if(state === 2){return '';}
        fireGlobals = opts.global;
        opts.type = opts.type.toUpperCase();
        opts.hasContent = !rnoContent.test(opts.type);
        
        //trigger ajaxStart start;
        //trigger ajaxStart end;
        if(!opts.hasContent){
            if(opts.data){
                opts.url += (~opts.url.indexOf('?') ? '&' : '?') + opts.data;
                delete opts.data;
            }
            ifModifiedKey = opts.url;
            if(opts.cache === false){
                var now = new Date().getTime(),
                    ret = opts.url.replace(rts, '$1_=' + now);
                opts.url = ret + (ret === opts.url ? (~opts.url.indexOf('?') ? '&' : '?') + '_=' + now : '');
            }
        }
        if(opts.data && opts.hasContent && opts.contentType !== false
            || options.contentType){
                tangXHR.setRequestHeader('Content-Type', opts.contentType);
        }
        if(opts.ifModified){
            ifModifiedKey = ifModifiedKey || opts.url;
            lastModified[ifModifiedKey]
                && tangXHR.setRequestHeader('If-Modified-Since', lastModified[ifModifiedKey]);
            etag[ifModifiedKey]
                && tangXHR.setRequestHeader('If-None-Match', etag[ifModifiedKey]);
        }
        
        tangXHR.setRequestHeader('Accept',
            opts.dataTypes[0] && opts.accepts[opts.dataTypes[0]] ?
                opts.accepts[opts.dataTypes[0]] + (opts.dataTypes[0] !== '*' ? ', ' + allTypes + '; q=0.01' : '')
                    : opts.accepts['*']);
        
        for(var i in opts.headers){
            tangXHR.setRequestHeader(i, opts.headers[i]);
        }
        if(opts.beforeSend && (opts.beforeSend.call(callbackContext, tangXHR, opts) === false || state === 2)){
            return tangXHR.abort();
        }
        strAbort = 'abort';
        for(var i in {success: 1, error: 1, complete: 1}){
            tangXHR[i](opts[i]);
        }
        transport = inspectPrefiltersOrTransports(transports, opts, options, tangXHR);
        if(!transport){
            done(-1, 'No Transport');
        }else{
            tangXHR.readyState = 1;
            //TODO trigger ajaxSend
            if(opts.async && opts.timeout > 0){
                timeoutTimer = setTimeout(function(){
                    tangXHR.abort('timeout')
                }, opts.timeout);
            }
            try{
                state = 1;
                transport.send(requestHeaders, done);
            }catch(e){
                if(state < 2){
                    done(-1, e);
                }else{
                    throw e;
                }
            }
        }
        return tangXHR;
    }, function(url, options){
        this.url = url;
        this.options = options;
    });
    
    ebuy361.ajax.settings = {
       url: ajaxLocation,
        isLocal: rlocalProtocol.test(ajaxLocParts[1]),
        global: true,
        type: 'GET',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        processData: true,
        async: true,
        
        accepts: {
            xml: 'application/xml, text/xml',
            html: 'text/html',
            text: 'text/plain',
            json: 'application/json, text/javascript',
            '*': allTypes
        },
        contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
        },
        responseFields: {
            xml: 'responseXML',
            text: 'responseText'
        },
        converters: {
            '* text': window.String,
            'text html': true,
            'text json': parseJSON,
            'text xml': parseXML
        },
        flatOptions: {
            context: true,
            url: true
        }
    };
    //
    function ajaxExtend(target, src){
        var flatOpt = ebuy361.ajax.settings.flatOptions || {},
            deep;
        for(var i in src){
            if(src[i] !== undefined){
                (flatOpt[i] ? target : (deep || (deep = {})))[i] = src[i]
            }
        }
        deep && ebuy361.extend(true, target, deep);
    }
    
    ebuy361.ajax.setup = function(target, settings){
        if(settings){
            ajaxExtend(target, ebuy361.ajax.settings);
        }else{
            settings = target;
            target = ebuy361.ajax.settings;
        }
        ajaxExtend(target, settings);
        return target;
    };
    
    //
    
    function addParam(array, key, val){
        val = ebuy361.type(val) === 'function' ? val() : (typeof val == 'undefined' || val == null ? '' : val);
        array.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    }
    function buildParams(array, key, val, traditional){
        if(ebuy361.type(val) === 'array'){
            ebuy361.forEach(val, function(item, index){
                if(traditional || rbracket.test(key)){
                    addParam(array, key, item);
                }else{
                    buildParams(array, key + '[' + (typeof item === 'object' ? index : '') + ']', item, traditional);
                }
            });
        }else if(!traditional && ebuy361.type(val) === "object"){
            for(var i in val){
                buildParams(array, key + '[' + i + ']', val[i], traditional);
            }
        }else{
            addParam(array, key, val);
        }
    }
    
    ebuy361.ajax.param = function(src, traditional){
        var ret = [];
        if(ebuy361.type(src) === 'array'){
            ebuy361.forEach(src, function(item){
                addParam(ret, item.name, item.value);
            });
        }else{
            for(var i in src){
                buildParams(ret, i, src[i], traditional);
            }
        }
        return ret.join('&').replace(/%20/g, '+');
    };
    
    ebuy361.ajax.prefilter = toPrefiltersOrTransports(prefilters);
    ebuy361.ajax.transport = toPrefiltersOrTransports(transports);
    
    //jsonp
    var oldCallbacks = [],
        rjsonp = /(=)\?(?=&|$)|\?\?/,
        nonce = new Date().getTime();
    ebuy361.ajax.setup({
        jsonp: 'callback',
        jsonpCallback: function(){
            var callback = oldCallbacks.pop() || (ebuy361.key + '_' + (nonce++));
            this[callback] = true;
            return callback;
        }
    });
    ebuy361.ajax.prefilter('json jsonp', function(opts, originalSettings, tangXHR){
        var callbackName, overwritten, responseContainer,
            data = opts.data,
            url = opts.url,
            hasCallback = opts.jsonp !== false,
            replaceInUrl = hasCallback && rjsonp.test(url),
            replaceInData = hasCallback && !replaceInUrl && ebuy361.type(data) === 'string'
                // && !~(opts.contentType || '').indexOf('application/x-www-form-urlencoded')
                && !(opts.contentType || '').indexOf('application/x-www-form-urlencoded')
                && rjsonp.test(data);
        if(opts.dataTypes[0] === 'jsonp' || replaceInUrl || replaceInData){
            callbackName = opts.jsonpCallback = ebuy361.type(opts.jsonpCallback) === 'function' ?
                opts.jsonpCallback() : opts.jsonpCallback;
            overwritten = window[callbackName];
            
            if (replaceInUrl) {
                opts.url = url.replace(rjsonp, '$1' + callbackName );
            } else if (replaceInData) {
                opts.data = data.replace(rjsonp, '$1' + callbackName );
            } else if (hasCallback) {
                opts.url += (/\?/.test(url) ? '&' : '?') + opts.jsonp + '=' + callbackName;
            }
            
            opts.converters['script json'] = function() {
//                !responseContainer && ebuy361.error( callbackName + " was not called" );
                return responseContainer[0];
            }
            
            opts.dataTypes[0] = 'json';
            window[callbackName] = function(){responseContainer = arguments;}
            tangXHR.always(function(){
                window[callbackName] = overwritten;
                if (opts[callbackName]){
                    opts.jsonpCallback = originalSettings.jsonpCallback;
                    oldCallbacks.push(callbackName);
                }
                if (responseContainer && ebuy361.type(overwritten) === 'function'){
                    overwritten(responseContainer[0]);
                }
                responseContainer = overwritten = undefined;
            });
            return 'script';
        }
    });
    
    ebuy361.ajax.setup({
        accepts: {script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'},
        contents: {script: /javascript|ecmascript/},
        converters: {'text script': function(txt){
            globalEval(txt);
            return txt;
        }}
    });
    
    ebuy361.ajax.prefilter('script', function(opts){
        opts.cache === undefined && (opts.cache = false);
        if(opts.crossDomain){
            opts.type = 'GET';
            opts.global = false;
        }
    });
    
    ebuy361.ajax.transport('script', function(opts){
        if(opts.crossDomain){
            var script,
                head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
            return {
                send: function(arg, callback){
                    script = document.createElement('script');
                    script.async = 'async';
                    opts.scriptCharset && (script.charset = opts.scriptCharset);
                    script.src = opts.url;
                    script.onload = script.onreadystatechange = function(arg, isAbort){
                        if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState)){
                            script.onload = script.onreadystatechange = null;
                            head && script.parentNode && head.removeChild( script );
                            script = undefined;
                            !isAbort && callback(200, 'success');
                        }
                    }
                    head.insertBefore(script, head.firstChild);
                },
                
                abort: function(){
                    script && script.onload(0, 1);
                }
            };
        }
    });
    
    var xhrCallbacks,
        xhrId = 0,
        xhrOnUnloadAbort = window.ActiveXObject ? function(){
            for ( var key in xhrCallbacks ) {
                xhrCallbacks[ key ]( 0, 1 );
            }
        } : false;
        
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch( e ) {}
    }
    
    function createActiveXHR() {
        try {
            return new window.ActiveXObject('Microsoft.XMLHTTP');
        } catch( e ) {}
    }
    
    ebuy361.ajax.settings.xhr = window.ActiveXObject ? function(){
        return !this.isLocal && createStandardXHR() || createActiveXHR();
    } : createStandardXHR;
    
    void function(xhr){
        ebuy361.extend(ebuy361._util_.support, {
            ajax: !!xhr,
            cors: !!xhr && ('withCredentials' in xhr)
        });
    }(ebuy361.ajax.settings.xhr());
    
    if(ebuy361._util_.support.ajax){
        ebuy361.ajax.transport(function(opts){
            if(!opts.crossDomain || ebuy361._util_.support.cors){
                var callback;
                return {
                    send: function(headers, complete){
                        var handle, xhr = opts.xhr();
                        //it's can not use apply here
                        if(opts.username){
                            xhr.open(opts.type, opts.url, opts.async, opts.username, opts.password);
                        }else{
                            xhr.open(opts.type, opts.url, opts.async);
                        }
                        
                        if(opts.xhrFields){
                            for(var i in opts.xhrFields){
                                xhr[i] = opts.xhrFields[i];
                            }
                        }
                        
                        if(opts.mimeType && xhr.overrideMimeType){
                            xhr.overrideMimeType(opts.mimeType);
                        }
                        
                        if(!opts.crossDomain && !headers['X-Requested-With']){
                            headers['X-Requested-With'] = 'XMLHttpRequest';
                        }
                        
                        try{
                            for(var i in headers){
                                xhr.setRequestHeader(i, headers[i]);
                            }
                        }catch(e){}

                        xhr.send((opts.hasContent && opts.data) || null);
                        
                        callback = function(arg, isAbort){
                            var status,
                                statusText,
                                responseHeaders,
                                responses,
                                xml;
                            try{
                                if(callback && (isAbort || xhr.readyState === 4)){
                                    callback = undefined;
                                    if (handle){
                                        xhr.onreadystatechange = function(){};
                                        xhrOnUnloadAbort && (delete xhrCallbacks[handle]);
                                    }
                                    
                                    if(isAbort){
                                        xhr.readyState !== 4 && xhr.abort();
                                    }else{
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();
                                        responses = {};
                                        xml = xhr.responseXML;
                                        xml && xml.documentElement && (responses.xml = xml);
                                        try{
                                            responses.text = xhr.responseText;
                                        }catch(e){}
                                        
                                        try{
                                            statusText = xhr.statusText;
                                        }catch(e){statusText = '';}
                                        if(!status && opts.isLocal && !opts.crossDomain){
                                            status = responses.text ? 200 : 404;
                                        }else if(status === 1223){
                                            status = 204;
                                        }
                                    }
                                }
                            }catch(firefoxAccessException){
                                !isAbort && complete(-1, firefoxAccessException);
                            }
                            responses && complete(status, statusText, responses, responseHeaders);
                        }
                        
                        if(!opts.async){
                            callback();
                        }else if(xhr.readyState === 4){
                            setTimeout(callback, 0)
                        }else{
                            handle = ++xhrId;
                            if(xhrOnUnloadAbort){
                                if(!xhrCallbacks){
                                    xhrCallbacks = {};
                                    ebuy361.dom(window).on('unload', xhrOnUnloadAbort);
                                }
                                xhrCallbacks[handle] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },
                    
                    abort: function(){
                        callback && callback(0, 1);
                    }
                };
            }
        });
    }
}();

ebuy361._util_.smartAjax = ebuy361._util_.smartAjax || function(method){
    return function(url, data, callback, type){
        if(ebuy361.type(data) === 'function'){
            type = type || callback;
            callback = data;
            data = undefined;
        }
        ebuy361.ajax({
            type: method,
            url: url,
            data: data,
            success: callback,
            dataType: type
        });
    };
};

ebuy361.get = ebuy361.get || ebuy361._util_.smartAjax('get');






ebuy361.post = ebuy361.post || ebuy361._util_.smartAjax('post');








ebuy361.createChain("sio",

// 执行方法
function(url){
    switch (typeof url) {
        case "string" :
            return new ebuy361.sio.$Sio(url);
        // break;
    }
},

// constructor
function(url){
    this.url = url;
});


ebuy361.sio._createScriptTag = function(scr, url, charset){
    scr.setAttribute('type', 'text/javascript');
    charset && scr.setAttribute('charset', charset);
    scr.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(scr);
};



ebuy361.sio._removeScriptTag = function(scr){
    if (scr.clearAttributes) {
        scr.clearAttributes();
    } else {
        for (var attr in scr) {
            if (scr.hasOwnProperty(attr)) {
                delete scr[attr];
            }
        }
    }
    if(scr && scr.parentNode){
        scr.parentNode.removeChild(scr);
    }
    scr = null;
};








 
ebuy361.sio.extend({
    callByBrowser : function (opt_callback, opt_options) {
        var url = this.url ;
        var scr = document.createElement("SCRIPT"),
            scriptLoaded = 0,
            options = opt_options || {},
            charset = options['charset'],
            callback = opt_callback || function(){},
            timeOut = options['timeOut'] || 0,
            timer;
        
        // IE和opera支持onreadystatechange
        // safari、chrome、opera支持onload
        scr.onload = scr.onreadystatechange = function () {
            // 避免opera下的多次调用
            if (scriptLoaded) {
                return;
            };
            
            var readyState = scr.readyState;
            if ('undefined' == typeof readyState
                || readyState == "loaded"
                || readyState == "complete") {
                scriptLoaded = 1;
                try {
                    callback();
                    clearTimeout(timer);
                } finally {
                    scr.onload = scr.onreadystatechange = null;
                    ebuy361.sio._removeScriptTag(scr);
                }
            }
        };

        if( timeOut ){
            timer = setTimeout(function(){
                scr.onload = scr.onreadystatechange = null;
                ebuy361.sio._removeScriptTag(scr);
                options.onfailure && options.onfailure();
            }, timeOut);
        };
        ebuy361.sio._createScriptTag(scr, url, charset);
    } 
});





//ebuy361.lang.isString = function (source) {
//    return '[object String]' == Object.prototype.toString.call(source);
//};
ebuy361.lang.isString = ebuy361.isString;







 
ebuy361.sio.extend({
    callByServer : function( callback, opt_options) {
        var url = this.url ;
        var scr = document.createElement('SCRIPT'),
            prefix = 'bd__cbs__',
            callbackName,
            callbackImpl,
            options = opt_options || {},
            charset = options['charset'],
            queryField = options['queryField'] || 'callback',
            timeOut = options['timeOut'] || 0,
            timer,
            reg = new RegExp('(\\?|&)' + queryField + '=([^&]*)'),
            matches;

        if (ebuy361.lang.isFunction(callback)) {
            callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
            window[callbackName] = getCallBack(0);
        } else if(ebuy361.lang.isString(callback)){
            // 如果callback是一个字符串的话，就需要保证url是唯一的，不要去改变它
            // TODO 当调用了callback之后，无法删除动态创建的script标签
            callbackName = callback;
        } else {
            if (matches = reg.exec(url)) {
                callbackName = matches[2];
            }
        }

        if( timeOut ){
            timer = setTimeout(getCallBack(1), timeOut);
        }

        //如果用户在URL中已有callback，用参数传入的callback替换之
        url = url.replace(reg, '\x241' + queryField + '=' + callbackName);
        
        if (url.search(reg) < 0) {
            url += (url.indexOf('?') < 0 ? '?' : '&') + queryField + '=' + callbackName;
        }
        ebuy361.sio._createScriptTag(scr, url, charset);

        
        function getCallBack(onTimeOut){
            
            return function(){
                try {
                    if( onTimeOut ){
                        options.onfailure && options.onfailure();
                    }else{
                        callback.apply(window, arguments);
                        clearTimeout(timer);
                    }
                    window[callbackName] = null;
                    delete window[callbackName];
                } catch (exception) {
                    // ignore the exception
                } finally {
                    ebuy361.sio._removeScriptTag(scr);
                }
            }
        }
    }

});




 
ebuy361.sio.extend({
  log : function() {
    var url = this.url ;
    var img = new Image(),
        key = 'ebuy361_sio_log_' + Math.floor(Math.random() *
              2147483648).toString(36);

    // 这里一定要挂在window下
    // 在IE中，如果没挂在window下，这个img变量又正好被GC的话，img的请求会abort
    // 导致服务器收不到日志
    window[key] = img;

    img.onload = img.onerror = img.onabort = function() {
      // 下面这句非常重要
      // 如果这个img很不幸正好加载了一个存在的资源，又是个gif动画
      // 则在gif动画播放过程中，img会多次触发onload
      // 因此一定要清空
      img.onload = img.onerror = img.onabort = null;

      window[key] = null;

      // 下面这句非常重要
      // new Image创建的是DOM，DOM的事件中形成闭包环引用DOM是典型的内存泄露
      // 因此这里一定要置为null
      img = null;
    };

    // 一定要在注册了事件之后再设置src
    // 不然如果图片是读缓存的话，会错过事件处理
    // 最后，对于url最好是添加客户端时间来防止缓存
    // 同时服务器也配合一下传递Cache-Control: no-cache;
    img.src = url;
  }
});






ebuy361.plugin = function(chainName, copy, fn, constructor){
    var isCopy = ebuy361.isPlainObject(copy), chain;
    if(!isCopy){
        constructor = fn;
        fn = copy;
    }
    ebuy361.type(fn) != 'function' && (fn = undefined);
    ebuy361.type(constructor) != 'function' && (constructor = undefined);
    chain = ebuy361.createChain(chainName, fn, constructor);
    isCopy && chain.extend(copy);
    return chain;
};


ebuy361.swf = ebuy361.swf || {};



ebuy361.swf.version = (function () {
    var n = navigator;
    if (n.plugins && n.mimeTypes.length) {
        var plugin = n.plugins["Shockwave Flash"];
        if (plugin && plugin.description) {
            return plugin.description
                    .replace(/([a-zA-Z]|\s)+/, "")
                    .replace(/(\s)+r/, ".") + ".0";
        }
    } else if (window.ActiveXObject && !window.opera) {
        for (var i = 12; i >= 2; i--) {
            try {
                var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
                if (c) {
                    var version = c.GetVariable("$version");
                    return version.replace(/WIN/g,'').replace(/,/g,'.');
                }
            } catch(e) {}
        }
    }
})();



ebuy361.swf.createHTML = function (options) {
    options = options || {};
    var version = ebuy361.swf.version, 
        needVersion = options['ver'] || '6.0.0', 
        vUnit1, vUnit2, i, k, len, item, tmpOpt = {},
        encodeHTML = ebuy361.string.encodeHTML;
    
    // 复制options，避免修改原对象
    for (k in options) {
        tmpOpt[k] = options[k];
    }
    options = tmpOpt;
    
    // 浏览器支持的flash插件版本判断
    if (version) {
        version = version.split('.');
        needVersion = needVersion.split('.');
        for (i = 0; i < 3; i++) {
            vUnit1 = parseInt(version[i], 10);
            vUnit2 = parseInt(needVersion[i], 10);
            if (vUnit2 < vUnit1) {
                break;
            } else if (vUnit2 > vUnit1) {
                return ''; // 需要更高的版本号
            }
        }
    } else {
        return ''; // 未安装flash插件
    }
    
    var vars = options['vars'],
        objProperties = ['classid', 'codebase', 'id', 'width', 'height', 'align'];
    
    // 初始化object标签需要的classid、codebase属性值
    options['align'] = options['align'] || 'middle';
    options['classid'] = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
    options['codebase'] = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0';
    options['movie'] = options['url'] || '';
    delete options['vars'];
    delete options['url'];
    
    // 初始化flashvars参数的值
    if ('string' == typeof vars) {
        options['flashvars'] = vars;
    } else {
        var fvars = [];
        for (k in vars) {
            item = vars[k];
            fvars.push(k + "=" + encodeURIComponent(item));
        }
        options['flashvars'] = fvars.join('&');
    }
    
    // 构建IE下支持的object字符串，包括属性和参数列表
    var str = ['<object '];
    for (i = 0, len = objProperties.length; i < len; i++) {
        item = objProperties[i];
        str.push(' ', item, '="', encodeHTML(options[item]), '"');
    }
    str.push('>');
    var params = {
        'wmode'             : 1,
        'scale'             : 1,
        'quality'           : 1,
        'play'              : 1,
        'loop'              : 1,
        'menu'              : 1,
        'salign'            : 1,
        'bgcolor'           : 1,
        'base'              : 1,
        'allowscriptaccess' : 1,
        'allownetworking'   : 1,
        'allowfullscreen'   : 1,
        'seamlesstabbing'   : 1,
        'devicefont'        : 1,
        'swliveconnect'     : 1,
        'flashvars'         : 1,
        'movie'             : 1
    };
    
    for (k in options) {
        item = options[k];
        k = k.toLowerCase();
        if (params[k] && (item || item === false || item === 0)) {
            str.push('<param name="' + k + '" value="' + encodeHTML(item) + '" />');
        }
    }
    
    // 使用embed时，flash地址的属性名是src，并且要指定embed的type和pluginspage属性
    options['src']  = options['movie'];
    options['name'] = options['id'];
    delete options['id'];
    delete options['movie'];
    delete options['classid'];
    delete options['codebase'];
    options['type'] = 'application/x-shockwave-flash';
    options['pluginspage'] = 'http://www.macromedia.com/go/getflashplayer';
    
    
    // 构建embed标签的字符串
    str.push('<embed');
    // 在firefox、opera、safari下，salign属性必须在scale属性之后，否则会失效
    // 经过讨论，决定采用BT方法，把scale属性的值先保存下来，最后输出
    var salign;
    for (k in options) {
        item = options[k];
        if (item || item === false || item === 0) {
            if ((new RegExp("^salign\x24", "i")).test(k)) {
                salign = item;
                continue;
            }
            
            str.push(' ', k, '="', encodeHTML(item), '"');
        }
    }
    
    if (salign) {
        str.push(' salign="', encodeHTML(salign), '"');
    }
    str.push('></embed></object>');
    
    return str.join('');
};


ebuy361.swf.create = function (options, target) {
    options = options || {};
    var html = ebuy361.swf.createHTML(options) 
               || options['errorMessage'] 
               || '';
                
    if (target && 'string' == typeof target) {
        target = document.getElementById(target);
    }
    ebuy361.dom.insertHTML( target || document.body ,'beforeEnd',html );
};






ebuy361.lang.toArray = function (source) {
    if (source === null || source === undefined)
        return [];
    if (ebuy361.lang.isArray(source))
        return source;

    // The strings and functions also have 'length'
    if (typeof source.length !== 'number' || typeof source === 'string' || ebuy361.lang.isFunction(source)) {
        return [source];
    }

    //nodeList, IE 下调用 [].slice.call(nodeList) 会报错
    if (source.item) {
        var l = source.length, array = new Array(l);
        while (l--)
            array[l] = source[l];
        return array;
    }

    return [].slice.call(source);
};

ebuy361.swf.getMovie = function (name) {
    //ie9下, Object标签和embed标签嵌套的方式生成flash时,
    //会导致document[name]多返回一个Object元素,而起作用的只有embed标签
    var movie = document[name], ret;
    return ebuy361.browser.ie == 9 ?
        movie && movie.length ? 
            (ret = ebuy361.array.remove(ebuy361.lang.toArray(movie),function(item){
                return item.tagName.toLowerCase() != "embed";
            })).length == 1 ? ret[0] : ret
            : movie
        : movie || window[name];
};






ebuy361.base = ebuy361.base || {blank: function(){}};




ebuy361.base.Class = (function() {
    var instances = (ebuy361._global_ = window[ebuy361.guid])._instances;
    instances || (instances = ebuy361._global_._instances = {});

    // constructor
    return function() {
        this.guid = ebuy361.id();
        this._decontrol_ || (instances[this.guid] = this);
    }
})();


ebuy361.extend(ebuy361.base.Class.prototype, {
    
    toString: ebuy361.base.Class.prototype.toString = function(){
        return "[object " + ( this._type_ || "Object" ) + "]";
    }

    
    ,dispose: function() {
        // 2013.1.11 暂时关闭此事件的派发
        // if (this.fire("ondispose")) {
            // decontrol
            delete ebuy361._global_._instances[this.guid];

            if (this._listeners_) {
                for (var item in this._listeners_) {
                    this._listeners_[item].length = 0;
                    delete this._listeners_[item];
                }
            }

            for (var pro in this) {
                if ( !ebuy361.isFunction(this[pro]) ) delete this[pro];
                else this[pro] = ebuy361.base.blank;
            }

            this.disposed = true;   //20100716
        // }
    }

    
    ,fire: function(event, options) {
        ebuy361.isString(event) && (event = new ebuy361.base.Event(event));

        var i, n, list, item
            , t=this._listeners_
            , type=event.type
            // 20121023 mz 修正事件派发多参数时，参数的正确性验证
            , argu=[event].concat( Array.prototype.slice.call(arguments, 1) );
        !t && (t = this._listeners_ = {});

        // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
        ebuy361.extend(event, options || {});

        event.target = event.target || this;
        event.currentTarget = this;

        type.indexOf("on") && (type = "on" + type);

        ebuy361.isFunction(this[type]) && this[type].apply(this, argu);
        (i=this._options) && ebuy361.isFunction(i[type]) && i[type].apply(this, argu);

        if (ebuy361.isArray(list = t[type])) {
            for ( i=list.length-1; i>-1; i-- ) {
                item = list[i];
                item && item.handler.apply( this, argu );
                item && item.once && list.splice( i, 1 );
            }
        }

        return event.returnValue;
    }

    
    ,on: function(type, handler, once) {
        if (!ebuy361.isFunction(handler)) {
            return this;
        }

        var list, t = this._listeners_;
        !t && (t = this._listeners_ = {});

        type.indexOf("on") && (type = "on" + type);

        !ebuy361.isArray(list = t[type]) && (list = t[type] = []);
        t[type].unshift( {handler: handler, once: !!once} );

        return this;
    }
    // 20120928 mz 取消on()的指定key

    ,once: function(type, handler) {
        return this.on(type, handler, true);
    }
    ,one: function(type, handler) {
        return this.on(type, handler, true);
    }

    
    ,off: function(type, handler) {
        var i, list,
            t = this._listeners_;
        if (!t) return this;

        // remove all event listener
        if (typeof type == "undefined") {
            for (i in t) {
                delete t[i];
            }
            return this;
        }

        type.indexOf("on") && (type = "on" + type);

        // 移除某类事件监听
        if (typeof handler == "undefined") {
            delete t[type];
        } else if (list = t[type]) {

            for (i = list.length - 1; i >= 0; i--) {
                list[i].handler === handler && list.splice(i, 1);
            }
        }

        return this;
    }
});
ebuy361.base.Class.prototype.addEventListener = 
ebuy361.base.Class.prototype.on;
ebuy361.base.Class.prototype.removeEventListener =
ebuy361.base.Class.prototype.un =
ebuy361.base.Class.prototype.off;
ebuy361.base.Class.prototype.dispatchEvent =
ebuy361.base.Class.prototype.fire;



window["ebuy361Instance"] = function(guid) {
    return window[ebuy361.guid]._instances[ guid ];
}




ebuy361.base.Event = function(type, target) {
    this.type = type;
    this.returnValue = true;
    this.target = target || null;
    this.currentTarget = null;
    this.preventDefault = function() {this.returnValue = false;};
};


//  2011.11.23  meizz   添加 ebuy361Instance 这个全局方法，可以快速地通过guid得到实例对象
//  2011.11.22  meizz   废除创建类时指定guid的模式，guid只作为只读属性

/// support magic - ebuy361 1.x Code Start




ebuy361.lang.Class = ebuy361.base.Class;
//  2011.11.23  meizz   添加 ebuy361Instance 这个全局方法，可以快速地通过guid得到实例对象
//  2011.11.22  meizz   废除创建类时指定guid的模式，guid只作为只读属性
//  2011.11.22  meizz   废除 ebuy361.lang._instances 模块，由统一的global机制完成；


/// support magic - ebuy361 1.x Code End






ebuy361.createClass = function(constructor, type, options) {
    constructor = ebuy361.isFunction(constructor) ? constructor : function(){};
    options = typeof type == "object" ? type : options || {};

    // 创建新类的真构造器函数
    var fn = function(){
        var me = this;

        // 20101030 某类在添加该属性控制时，guid将不在全局instances里控制
        options.decontrolled && (me._decontrol_ = true);

        // 继承父类的构造器
        fn.superClass.apply(me, arguments);

        // 全局配置
        for (var i in fn.options) me[i] = fn.options[i];

        constructor.apply(me, arguments);

        for (var i=0, reg=fn._reg_; reg && i<reg.length; i++) {
            reg[i].apply(me, arguments);
        }
    };

    ebuy361.extend(fn, {
        superClass: options.superClass || ebuy361.base.Class

        ,inherits: function(superClass){
            if (typeof superClass != "function") return fn;

            var C = function(){};
            C.prototype = (fn.superClass = superClass).prototype;

            // 继承父类的原型（prototype)链
            var fp = fn.prototype = new C();
            // 继承传参进来的构造器的 prototype 不会丢
            ebuy361.extend(fn.prototype, constructor.prototype);
            // 修正这种继承方式带来的 constructor 混乱的问题
            fp.constructor = constructor;

            return fn;
        }

        ,register: function(hook, methods) {
            (fn._reg_ || (fn._reg_ = [])).push( hook );
            methods && ebuy361.extend(fn.prototype, methods);
            return fn;
        }
        
        ,extend: function(json){ebuy361.extend(fn.prototype, json); return fn;}
    });

    type = ebuy361.isString(type) ? type : options.className || options.type;
    ebuy361.isString(type) && (constructor.prototype._type_ = type);
    ebuy361.isFunction(fn.superClass) && fn.inherits(fn.superClass);

    return fn;
};

// 20111221 meizz   修改插件函数的存放地，重新放回类构造器静态属性上
// 20121105 meizz   给类添加了几个静态属性方法：.options .superClass .inherits() .extend() .register()

/// support magic - ebuy361 1.x Code Start






ebuy361.lang.createClass = ebuy361.createClass;

// 20111221 meizz   修改插件函数的存放地，重新放回类构造器静态属性上

/// support magic - ebuy361 1.x Code End


ebuy361.swf.Proxy = function(id, property, loadedHandler) {
    
    var me = this,
        flash = this._flash = ebuy361.swf.getMovie(id),
        timer;
    if (! property) {
        return this;
    }
    timer = setInterval(function() {
        try {
            
            if (flash[property]) {
                me._initialized = true;
                clearInterval(timer);
                if (loadedHandler) {
                    loadedHandler();
                }
            }
        } catch (e) {
        }
    }, 100);
};

ebuy361.swf.Proxy.prototype.getFlash = function() {
    return this._flash;
};

ebuy361.swf.Proxy.prototype.isReady = function() {
    return !! this._initialized;
};

ebuy361.swf.Proxy.prototype.call = function(methodName, var_args) {
    try {
        var flash = this.getFlash(),
            args = Array.prototype.slice.call(arguments);

        args.shift();
        if (flash[methodName]) {
            flash[methodName].apply(flash, args);
        }
    } catch (e) {
    }
};




ebuy361.setBack = function(current, oldChain) {
    current._back_ = oldChain;
    current.getBack = function() {
        return this._back_;
    }
    return current;
};





ebuy361.createSingle = function (methods, type) {
    var me = new ebuy361.base.Class();
    ebuy361.isString(type) && ( me._type_ = type );
    return ebuy361.extend(me, methods);
};


















ebuy361.plugin = ebuy361.plugin || {};
ebuy361.plugin._util_ = ebuy361.plugin._util_ || {};

ebuy361.plugin._util_.drag = function(selector){

    var timer,

        doc = ebuy361.dom(document),

        //只对第一个值操作
        ele = ebuy361.dom(selector).eq(0),

        //拖拽前的offset值
        offset = ele.offset(),

        //相对宽度和高度
        width,height,

        //限定拖动范围，如果有值，则为 {top:,right:,bottom:,left:}
        range,

        //跟随鼠标移动
        move = function(ele,x,y){
            if(range){

                //优化超速移动鼠标的情况，兼容有border的情况
                x = Math.min(range.right - range.width, Math.max(range.left, x));
                y = Math.min(range.bottom - range.height, Math.max(range.top, y));
            };

            //相对屏幕设置位置
            ele.offset({'left':x,'top':y});

            //对全局派发事件
            doc.trigger('dragging');
        },

        handle = function(event){

            //增加函数节流，防止事件频繁触发函数，影响性能
            if(timer){return};
            timer = setTimeout(function(){
                var o = ele.offset();
                !width && (width = event.pageX - o.left);
                !height && (height = event.pageY - o.top);
                move(ele,event.pageX - width,event.pageY - height);
                timer = null;
            },16);
        },

        //防止拖拽过程中选择上文字
        unselect = function (e) {
            return e.preventDefault();
        },

        onEvent = function(){

            //修正拖曳过程中页面里的文字会被选中
            doc.on('selectstart',unselect);
            doc.on('mousemove',handle);

            //设置鼠标粘滞
            if (ele[0].setCapture) {
                ele[0].setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
            };

            //清除鼠标已选择元素
            if(document.selection){
                document.selection.empty && document.selection.empty();
            }else if(window.getSelection){
                window.getSelection().removeAllRanges();
            };
        },

        offEvent = function(){

            //防止最后一次的触发
            clearTimeout(timer);

            //解除鼠标粘滞
            if (ele[0].releaseCapture) {
                ele[0].releaseCapture();
            } else if (window.releaseEvents) {
                window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
            };
            doc.off('mousemove',handle);
            doc.off('selectstart',unselect);
        };

    doc.trigger('dragstart',{target:ele});
    onEvent();

    return {
        target:ele,
        disable:function(){
            offEvent();
            width = height = null;
            doc.trigger('dragend');
            return this;
        },
        enable:function(){
            doc.trigger('dragstart');
            onEvent();
            return this;
        },
        range:function(value){
            if(value === undefined){
                return range;
            };
            var uRange = value, el;
            if(ebuy361.type(value) !== 'object'){
                el = ebuy361.dom(value).eq(0);
                uRange = el.offset();
                uRange.right = uRange.left + el.outerWidth();
                uRange.bottom = uRange.top + el.outerHeight();
            };
            range = ebuy361.extend({
                left: Number.MIN_VALUE,
                top: Number.MIN_VALUE,
                right: Number.MAX_VALUE,
                bottom: Number.MAX_VALUE,
                width: ele.outerWidth(),
                height: ele.outerHeight()
            }, uRange);
            return this;
        },

        //取消上一次拖拽
        cancel:function(){
            ele.offset(offset);
            return this;
        },

        //析构函数
        dispose:function(){
            offEvent();
            width = height = doc = ele = offset = range = null;
            for(var k in this){
                delete this[k];
            };
            this.dispose = true;
            return null;
        }
    }
};





ebuy361.dom.extend({
    isCrash : function(selector,strict){
        if(!arguments.length){ 
            return false; 
        };

        //传入的元素，get first
        var me = this,
            ele = ebuy361.dom(selector).eq(0),
            o = ele.offset(),
            w = ele.outerWidth(),
            h = ele.outerHeight(),
            num = me.size(),

            //检测算子，传入四个值比较，strict（是否严格）
            check = function(top,right,bottom,left,strict){
                if(strict){

                    //严格模式，一定要在容器内
                    if((o.top>=top)&&((o.top+h)<=bottom)&&(o.left>=left)&&((o.left+w)<=right)){
                        return true;
                    };

                }else{

                    //非严格模式，有碰撞或交集即可
                    if(((o.top+h)>=top)&&(o.top<=bottom)&&((o.left+w)>=left)&&(o.left<=right)){
                        return true;
                    };
                };
            };

        for(var i = 0; i < num; i++ ){
            var _ele = me.eq(i),
                _o = _ele.offset(),
                _w = _ele.eq(i).outerWidth(),
                _h = _ele.eq(i).outerHeight();

            if(check(_o.top,_o.left+_w,_o.top+_h,_o.left,strict)){
                return true;
            };
        };

        return false;
    }
});

// //检测两区域是否碰撞
// check(a1,a2){
//     if(a1.top>a2.bottom||a1.bottom<a2.top||a1.left>a2.right||a1.right<a2.left){
//         return false;
//     }else{
//         return true;
//     };
// };

ebuy361.dom.extend({
    draggable:function(value,opts){

        var me = this,

            //存放drag实例，drag.target是当前的拖拽元素
            drag,

            //存放当前拖拽元素
            dragEle,

            //drag enter的元素列表，在drag leave中会监测
            dragEnter = {},

            //最初的位置
            _offset,

            //关注的元素
            focusEle,

            //初始化设置的值，挂在在实例上
            funs = {

                //默认参数及初始值
                options:{
                    enable:true 
                    // range:undefined,
                    // endOf:undefined,
                    // zIndex:undefined,
                    // focus:undefined,

                    // //事件相关
                    // onstart:undefined,
                    // onend:undefined,
                    // onenter:undefined,
                    // onleave:undefined,
                    // ondragging:undefined
                },

                //可拖拽的范围，传入Object要符合{'top':123,'right':123,'bottom':123,'left':123}
                range:function(value){
                    switch(arguments.length){
                        
                        //不传参，get方法
                        case 0:
                            return opt.range;
                        break;

                        //传一个参数
                        case 1:

                            //value是selector
                            opt.range = value;
                        break;
                    };
                    return draggable;
                },

                //最终要拖拽到
                endOf:function(value){
                    switch(arguments.length){
                        
                        //不传参，get方法
                        case 0:

                            //内部endOf方法。
                            if(ebuy361.type(opt.endOf)=='object'){

                                //endOf的范围是Object,{'top':123,'right':123,'bottom':123,'left':123}
                                if(!dragEle.w){
                                    dragEle.w = dragEle.outerWidth();
                                    dragEle.h = dragEle.outerHeight();
                                };
                                var o = dragEle.offset(),
                                    eo = opt.endOf;
                               
                                if( o.left >= eo.left && o.left + dragEle.w <= eo.right && o.top >= eo.top && o.top + dragEle.h <= eo.bottom){
                                }else{
                                    draggable.cancel();
                                };
                            }else{

                                //endOf的范围是selector
                                if(!ebuy361.dom(opt.endOf).isCrash(drag.target,true)){
                                    draggable.cancel();
                                };                                
                            };
                            return opt.endOf;
                        //break;

                        //传一个参数
                        case 1:

                            //value是selector或者是object;
                            opt.endOf = value;
                        break;
                    };
                    return draggable;
                },

                //获取当前正在被拖拽的元素，或者上一次被拖拽的元素
                item:function(){
                    return dragEle;
                },

                //显示层级
                zIndex:function(value){
                    if(typeof value != 'undefined'){
                        opt.zIndex = value;
                        me.css('z-index',value);
                        return draggable;
                    }else{
                        return opt.zIndex;
                    };
                },

                //重置方法，恢复到最初
                reset:function(){
                    if(drag){
                        dragEle.offset(_offset);
                    };
                    return draggable;
                },

                //取消拖拽，回到上一次
                cancel:function(){
                    if(drag){
                        drag.cancel();
                    };
                    return draggable;
                },

                //关闭拖拽
                disable:function(){
                    if(opt.enable){
                        opt.enable = false;
                        if(value && ebuy361.type(value)!='object'){
                            me.find(value).css('cursor','default');
                        }else{
                            me.css('cursor','default');
                        };
                    };
                    return draggable;
                },

                //开启拖拽
                enable:function(){
                    if(!opt.enable){
                        opt.enable = true;
                        if(value && ebuy361.type(value)!='object'){
                            me.find(value).css('cursor','move');
                        }else{
                            me.css('cursor','move');
                        };
                    };
                    return draggable;
                },

                //析构函数
                dispose:function(){
                    draggable.disable();
                    if(drag && drag.dispose != true){
                        drag.dispose();
                    };

                    //此处删除所有事件，如果用户有其他事件可能会一起删除。
                    //TODO：后续修改下。
                    me.off('mousedown');
                    drag = dragEle = focusEle = doc = opt = null;
                    for(var k in draggable){
                        delete draggable[k];
                    };
                    draggable.dispose = true;
                    return null;
                }
            },
            doc = ebuy361.dom(document),

            //当前的draggable实例，自动挂载getBack方法，直接返回之前的链头
            draggable = ebuy361.setBack(ebuy361.createSingle(funs),me),

            opt = draggable.options,

            //拖拽执行（主逻辑），mousedown时触发
            handle = function(e){
                //拖拽是否可用
                //表单不可拖拽，原因是如果父元素可拖拽，子元素是表单元素，在mousedown的情况下改变父元素的position值，在ff和ie下会导致子元素永远取不到焦点，无法在表单中输入内容
                if(~'input|textarea|select|option'.indexOf(e.target.tagName.toLowerCase())
                    || !opt.enable){
                    return;
                }
                //实例一个drag
                drag && drag.dispose();
                drag = ebuy361.plugin._util_.drag(e.currentTarget);
                dragEle = drag.target;
                dragEle.addClass('tang-draggable-dragging');
                draggable.fire('start',{target:dragEle,pageX:e.pageX,pageY:e.pageY});
                if(!_offset){
                    _offset = dragEle.offset();
                };

                //限制了范围
                if(opt.range){
                    drag.range(opt.range);
                };

                //是否有层级设置
                if(opt.zIndex){
                    draggable.zIndex(opt.zIndex);
                };
                                
                doc.on('mouseup',endHandle);
                doc.on('dragging',ingHandle);
            },

            //拖拽停止
            endHandle = function(e){

                //是否到达拖拽目的地
                if(opt.endOf){
                    draggable.endOf();
                };
                dragEle.removeClass('tang-draggable-dragging');
                drag.disable();
                draggable.fire('end');
                doc.off('mouseup',endHandle);
                doc.off('dragging',ingHandle);
            },

            //拖拽中
            ingHandle = function(e){
                draggable.fire('dragging');
                enterAndLeave();
            },

            //初始化事件相关绑定
            bindEvent = function(){
                var evts = ['start','end','dragging','enter','leave'];
                for(var i = 0;i<evts.length; i++){
                    if( opt[ 'on'+evts[i] ] ){
                        draggable.on( evts[ i ] ,opt[ 'on'+evts[i] ] );
                    };
                };
            },

            //根据第二个selector，设置拖拽激活区，只对该区域监听mousedown事件
            setItem = function(){
                me.find(value).css('cursor','move');
                me.on('mousedown',function(e){
                    if(ebuy361.dom(e.currentTarget).contains(e.target)){
                        handle(e);
                    };
                });
            },

            //当用户传入options时，处理逻辑
            setOpt = function(opts){
                for(var k in opts){
                    opt[k] = opts[k];
                };
                if(opt.focus){

                    //要去掉自己本身
                    focusEle = ebuy361.dom(opt.focus).not(me);
                };
                if(opt.zIndex){
                    draggable.zIndex(opt.zIndex);
                };
                if(opt.enable == false){
                    opt.enable = true;
                    draggable.disable();
                };
                bindEvent();   
            },

            //实现draggable中的'enter'和‘leave’事件
            enterAndLeave = function(){
                if( opt.focus  && (opt.onenter||opt.onleave) ){

                    //存储当前enter的元素
                    var _dragEnter = {};

                    for(var i = 0,num = focusEle.size(); i < num; i++){
                        
                        var _e = focusEle.eq(i),
                            id = ebuy361.id(_e.get(0));

                        if( _e.isCrash(dragEle) ){

                            //观察对象的改变来触发
                            if(!dragEnter[id]){
                                dragEnter[id] = _e.get(0);
                                draggable.fire('enter',{'target':dragEnter[id]});
                            };
                            _dragEnter[id] = _e.get(0);
                        };

                    };

                    //判断是否触发leave事件
                    for(var k in dragEnter){
                        if(dragEnter[k] && !_dragEnter[k]){
                            draggable.fire('leave',{'target':dragEnter[k]});
                            dragEnter[k] = null;
                        };
                    };
                };
            };

        //函数参数逻辑
        switch(arguments.length){

            //没有传参，默认执行
            case 0:
                me.css('cursor','move').on('mousedown',handle);
            break;

            //传入一个参数
            case 1:
                if( ebuy361.type(value) == 'object' ){

                    //value是options
                    me.css('cursor','move').on('mousedown',handle);
                    setOpt(value);
                }else{
                
                    //value是selector
                    setItem();
                }
            break;

            //传入selector和options
            case 2:

                //value是selector
                setItem();
                setOpt(opts);
            break;
        };

        //暴露getBack()方法，返回上一级ebuy361Dom链头
        return draggable;
    }
});




























ebuy361.plugin._util_.rubberSelect = function(options){
    var doc = ebuy361.dom(document),
        opts = options || {},

        //限制可触发的范围,selector或者是Object，来自options.range
        range,

        //监测点击是否在限制区内，在为true
        rangeFlag,

        //TODO：以后可以考虑支持enter和leave事件
        //关注的元素，来自options.focus
        //focus,

        //遮罩层虚线，具体样式在CSS中设置
        mask,

        //第一次mousedown时的鼠标位置
        x1,y1,
        x2,y2,
        _x2,_y2,

        //函数节流计时器
        timer,

        //延时0.15秒计时器
        delayTimer,

        handle = function(e){
            clearTimeout(delayTimer);
            x1 = e.pageX;
            y1 = e.pageY;

            //监测范围
            if(range){

                //不在限制范围内
                if(x1<range.left||x1>range.right||y1<range.top||y1>range.bottom){
                    rangeFlag = false;
                    return;
                };
            };

            rangeFlag = true;            
            doc.trigger('rubberselectstart');

            //为了兼容快速点击的情况
            doc.trigger('rubberselecting');

            //防止其他实例将mask清除了。
            setMask();
            mask.width(0).height(0).show().offset({left:x1,top:y1});

            doc.on('mousemove',ingHandle);
            
            //修正拖曳过程中页面里的文字会被选中
            doc.on('selectstart',unselect);

            //设置鼠标粘滞
            if (mask.setCapture) {
                mask.setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
            };

            //清除鼠标已选择元素
            if(document.selection){
                document.selection.empty && document.selection.empty();
            }else if(window.getSelection){
                window.getSelection().removeAllRanges();
            };      
        },

        ingHandle = function(e){

            //增加函数节流，防止事件频繁触发函数，影响性能
            clearTimeout(timer);
            timer = setTimeout(function(){
                doc.trigger('rubberselecting');
                _x2 = e.pageX;
                _y2 = e.pageY;

                //监测范围
                if(range){

                    //不在限制范围内
                    if(_x2<range.left){
                        x2 = range.left;
                    }else if(_x2>range.right){
                        x2 = range.right;
                    }else{
                        x2 = _x2;
                    };
                    if(_y2<range.top){
                        y2 = range.top;
                    }else if(_y2>range.bottom){
                        y2 = range.bottom;
                    }else{
                        y2 = _y2;
                    };
                }else{
                    x2 = _x2;
                    y2 = _y2;
                };

                //橡皮筋移动算子
                //TODO： 此处的width和height应该减去border的宽度
                if(x2>x1&&y2>y1){
                    mask.width(x2-x1).height(y2-y1);
                }else if(x2>x1&&y1>y2){
                    mask.width(x2-x1).height(y1-y2).offset({left:x1,top:y2});
                }else if(x1>x2&&y1<y2){
                    mask.width(x1-x2).height(y2-y1).offset({left:x2,top:y1});
                }else if(x1>x2&&y1>y2){
                    mask.width(x1-x2).height(y1-y2).offset({left:x2,top:y2});
                };

            //这里是因为我喜欢3这个数字，所以用3毫秒。    
            },3);
        },

        endHandle = function(){
            if(rangeFlag){

                doc.off('selectstart',unselect);    
                doc.off('mousemove',ingHandle);

                //解除鼠标粘滞
                if (mask.releaseCapture) {
                    mask.releaseCapture();
                } else if (window.releaseEvents) {
                    window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
                };
                clearTimeout(delayTimer);
                delayTimer = setTimeout(function(){
                    ebuy361.dom(document).trigger('rubberselectend');
                    ebuy361.dom('.tang-rubberSelect').hide();

                //用户选择阶段延时0.15秒取消，使用户可以续选，雅虎交互原则。    
                },150);
            };
        },

        //防止拖拽过程中选择上文字
        unselect = function (e) {
            return e.preventDefault();
        },

        setRange = function(){
            if(opts.range){
                if(ebuy361.type(opts.range)=='object'){
                    range = opts.range;
                }else{

                    //传入的是selector
                    var _ele = ebuy361.dom(opts.range).eq(0);
                    range = _ele.offset();
                    range.bottom = range.top + _ele.outerHeight();
                    range.right = range.left + _ele.outerWidth();
                };
            };
        },

        setMask = function(){
            mask = ebuy361.dom('.tang-rubberSelect');
            if(!mask.size()){
                mask = ebuy361.dom('<div class="tang-rubberSelect" style="position:absolute;">');
            };
            mask.hide().appendTo(document.body);
        };

    //函数主逻辑开始
    setRange();
    setMask();
    doc.on('mousedown',handle);
    doc.on('mouseup',endHandle);

    return{
        target:mask,

        //设置范围
        range :function(value){
            if(!value){
                return opts.range;
            }else{
                opts.range = value;
                setRange();
                return this;
            };
        },

        //析构函数
        dispose:function(){
            
            doc.off('mousedown',handle);
            //doc.off('mousemove',ingHandle);
            doc.off('mouseup',endHandle);

            //因为其他实例中可能会用到，所以不做清除。
            //mask.remove();
            
            doc = timer = null;
            for(var k in this){
                delete this[k];
            };
            this.dispose = true;
            return null;
        }
    }
};

ebuy361.dom.extend({
    selectable:function(value,opts){

        var me = this,

            //初始化设置的值，挂载在实例上
            funs = {

                //默认参数及初始值
                options:{

                    //是否可用
                    enable:true,

                    //通过按下ctrl或者command间隔选择
                    intervalSelect:true
                    
                    //可以激活选择功能的范围 
                    // range:undefined,

                    //事件相关
                    // onstart:undefined,
                    // onend:undefined,
                    // ondragging:undefined,

                    //选择元素改变时触发，增加和减少都会触发
                    // onchange:undefined
                },

                //激活选择的范围，传入selector或者Object要符合{'top':123,'right':123,'bottom':123,'left':123}
                range:function(value){
                    if(value && rubberSelect && rubberSelect.dispose != true){
                        opt.range = value;
                        rubberSelect.range(value);
                        return selectable;
                    }else{
                        return opt.range;
                    };
                },

                //取消选择，恢复上次选择的结果
                cancel:function(){
                    if(lastSelected){
                        item.removeClass('tang-selectable-selected');
                        lastSelected.addClass('tang-selectable-selected');
                    }else{
                        selectable.reset();
                    }
                    return selectable;
                },

                //取消选择，恢复为一个都没选
                reset:function(){
                    lastSelected = me.find('.tang-selectable-selected');
                    item.removeClass('tang-selectable-selected');
                    return selectable;
                },
                
                //关闭选择功能
                disable:function(){
                    opt.enable = false;
                    if(rubberSelect && rubberSelect.dispose != true){
                        rubberSelect.dispose();
                        offDocEvent();
                    };
                    return selectable;
                },

                //开启选择功能
                enable:function(){
                    if(!opt.enable){
                        opt.enable = true;
                        if(rubberSelect && rubberSelect.dispose == true){
                            rubberSelect = ebuy361.plugin._util_.rubberSelect();
                        };
                        bindDocEvent();
                    };
                    return selectable;
                },

                //析构函数
                dispose:function(){
                    selectable.disable();
                    doc = rubberSelect = item = timer = null;
                    for(var k in selectable){
                        delete selectable[k];
                    };
                    selectable.dispose = true;
                    return null;
                },

                //设置或取得当前选中的项
                selected:function(value){
                    if(value){
                        me.find(value).addClass('tang-selectable-selected');
                        return selectable;
                    }else{
                        return me.find('.tang-selectable-selected');
                    };
                },

                //取得没有选中的值
                unselected:function(value){
                    if(value){
                        me.find(value).removeClass('tang-selectable-selected');
                        return selectable;
                    }else{
                        return item.not('.tang-selectable-selected');
                    };
                },

                //取得当前所有元素
                item:function(){
                    return item;
                },

                //取得当前选择元素的编号，或通过数组设置
                index:function(value){
                    if(ebuy361.type(value)=='array'){
                        item.removeClass('tang-selectable-selected');
                        for(var i = 0,num = value.length;i<num;i++){
                            item.eq(value[i]).addClass('tang-selectable-selected');
                        };
                        return selectable;
                    }else{
                        var arr = [];
                        for(var i = 0, num = item.size();i<num;i++){
                            if(item.eq(i).hasClass('tang-selectable-selected')){
                                arr.push(i);
                            };
                        };
                        return arr;
                    };
                }

            },

            doc = ebuy361.dom(document),

            //当前的selectable实例，自动挂载getBack方法，直接返回之前的链头
            selectable = ebuy361.setBack(ebuy361.createSingle(funs),me),

            opt = selectable.options,

            //存放rubberSelect
            rubberSelect,

            //selectable的item
            item,

            //存储上一次选择的项，cancel方法中用来还原
            lastSelected,

            //函数节流计时器
            timer,

            //按键多选的标志量，可以多选为true
            keydownMore = false,

            //初始化事件相关绑定
            bindEvent = function(){
                var evts = ['start','end','dragging','change'];
                for(var i = 0,num = evts.length;i< num; i++){
                    if( opt[ 'on'+evts[i] ] ){
                        selectable.on( evts[ i ] ,opt[ 'on'+evts[i] ] );
                    };
                };

                selectable.on('start',function(){
                    lastSelected = me.find('.tang-selectable-selected');
                });

                //支持多选功能
                selectable.on('end',function(){
                    item.removeClass('tang-selectable-selecting');
                });
            },

            handle = function(){

                //增加函数节流，防止事件频繁触发函数，影响性能
                clearTimeout(timer);
                timer = setTimeout(function(){
                    selectable.fire('dragging');
                    if(!item){return;};
                    if(!keydownMore){

                        //只能选择一次
                        for(var i = 0 , num = item.size(); i < num; i ++){
                            var _ele = item.eq(i);
                            if(_ele.isCrash(rubberSelect.target)){
                                if (!_ele.hasClass('tang-selectable-selected')) {
                                    selectable.fire('change',{target:_ele});
                                    _ele.addClass('tang-selectable-selected');
                                };
                            }else{
                                if(_ele.hasClass('tang-selectable-selected')){
                                    selectable.fire('change',{target:_ele});
                                    _ele.removeClass('tang-selectable-selected');
                                };
                            };
                        };
                    }else{

                        //按下了ctrl 或 command 键，可以多次选择
                        for(var i = 0 , num = item.size(); i < num; i ++){
                            var _ele = item.eq(i);

                            //只对选了的做判断
                            if(_ele.isCrash(rubberSelect.target) && !_ele.hasClass('tang-selectable-selecting')){
                                selectable.fire('change',{target:_ele});

                                //支持可以多次选择，判断此次碰撞是否已经选择了
                                _ele.addClass('tang-selectable-selecting');                              
                                if (!_ele.hasClass('tang-selectable-selected')) {
                                    _ele.addClass('tang-selectable-selected');
                                }else{
                                    _ele.removeClass('tang-selectable-selected');
                                };
                            };
                        };
                    };

                },3);
            },

            keyDownHandle = function(e){
                    
                //Win下Ctrl 和 Mac下 command 键
                if(e.ctrlKey || e.keyCode == 91){
                    keydownMore = true;
                };
            },

            keyUpHandle = function(e){

                //Win下Ctrl 和 Mac下 command 键
                if(!e.ctrlKey || e.keyCode == 91){
                    keydownMore = false;
                    item.removeClass('tang-selectable-selecting');
                };
            },

            fireStart = function(){
                selectable.fire('start');
            },

            fireEnd = function(){
                selectable.fire('end');
            },

            bindDocEvent = function(){
                if(opt.intervalSelect){
                    doc.on('keydown',keyDownHandle);
                    doc.on('keyup',keyUpHandle);
                };
                doc.on('rubberselecting',handle);
                doc.on('rubberselectstart',fireStart);
                doc.on('rubberselectend',fireEnd);
            },

            //统一的解绑事件
            offDocEvent = function(){
                if(opt.intervalSelect){
                    doc.off('keydown',keyDownHandle);
                    doc.off('keyup',keyUpHandle);
                };
                doc.off('rubberselecting',handle);
                doc.off('rubberselectstart',fireStart);
                doc.off('rubberselectend',fireEnd);                    
            },

            setOpt = function(opts){
                for(var k in opts){
                    opt[k] = opts[k];
                };
                if(opt.enable == false){
                    selectable.disable();
                };
                if(opt.range){
                    selectable.range(opt.range);
                };
            };

        //函数参数逻辑
        rubberSelect = ebuy361.plugin._util_.rubberSelect();
        switch(arguments.length){

            //没有传参，默认执行
            case 0:
                item = me.children();
            break;

            //传入一个参数
            case 1:
                if(ebuy361.type(value) == 'object'){

                    //此时value为options
                    item = me.children();
                    setOpt(value);
                }else{

                    //此时是selector
                    item = me.find(value);
                };

            break;

            //传入selector和options
            case 2:
                item = me.find(value);
                setOpt(opts);
            break;
        };
        bindEvent();
        bindDocEvent();
        
        //暴露getBack()方法，返回上一级ebuy361Dom链头
        return selectable;
    }
});

















ebuy361.dom.extend({
    sortable : function(value,opts){

        var me = this,
            argsNum = arguments.length,

            //每一个可以被拖拽的项
            item,

            //每个元素的相关值
            itemAttr = [],

            //当前的draggable对象
            draggable,

            //当前被拖拽的项
            dragEle,

            //当前拖拽元素的相关属性信息
            dragEleAttr = {},

            //克隆的拖拽元素
            dragEleClone,
            dragEleCloneAttr = {},

            //当前sortable内的HTML，为了能够完美实现reset方法
            htmlReset = '',

            //每次变化后sortable内的HTML，为了能够完美实现cancel方法
            htmlCancel = '',
            htmlTemp = '',

            //初始化设置的值，挂在在实例上
            funs = {

                //默认参数及初始值
                options:{
                    enable:true 
                    // range:undefined,

                    //事件相关
                    // onstart:undefined,
                    // onend:undefined,
                    // ondragging:undefined,
                    // onchange:undefined
                },

                //可拖拽的范围，传入Object要符合{'top':123,'right':123,'bottom':123,'left':123}
                range:function(value){
                    switch(arguments.length){
                        
                        //不传参，get方法
                        case 0:
                            return opt.range;
                        break;

                        //传一个参数
                        case 1:

                            //value是selector
                            opt.range = value;
                            draggable.range(value);
                        break;
                    };
                    return sortable;
                },

                //取出可以被拖拽的项，顺序为新顺序
                item:function(){
                    return me.find('.tang-sortable-item');
                },

                //索引
                index:function(value){
                    if(value == 'set'){

                        //set方法，内部接口
                        for(var i = 0,num = item.size();i<num;i++){
                            item.eq(i).data('sortable-id',i);
                        };
                        return sortable;
                    }else{
                        var index = [],
                            _item = me.find('.tang-sortable-item');
                        for(var i = 0,num = _item.size();i<num;i++){
                            index.push(_item.eq(i).data('sortable-id'));
                        };
                        return index;
                    };
                },

                //取消拖拽，回到上一次
                cancel:function(){
                    me.html(htmlCancel);
                    init();
                    (opt.enable == false) && sortable.disable();
                    return sortable;
                },

                //重置拖拽
                reset:function(){
                    me.html(htmlReset);
                    init();
                    (opt.enable == false) && sortable.disable();
                    return sortable;
                },

                //关闭拖拽
                disable:function(){
                    opt.enable = false;
                    item.removeClass('tang-sortable-item');
                    draggable.disable();
                    return sortable;
                },

                //开启拖拽
                enable:function(){
                    if(!opt.enable){
                        opt.enable = true;
                        draggable.enable();
                    };
                    return sortable;
                },

                //析构函数
                dispose:function(){
                    sortable.disable();
                    draggable.dispose();
                    doc = opt = me = item = itemAttr = dragEle = dragEleAttr = dragEleClone = dragEleCloneAttr = null;
                    for(var k in sortable){
                        delete sortable[k];
                    };
                    sortable.dispose = true;
                    return null;
                }
            },

            doc = ebuy361.dom(document),

            //当前的sortable实例，自动挂载getBack方法，直接返回之前的链头
            sortable = ebuy361.setBack(ebuy361.createSingle(funs),me),

            opt = sortable.options,

            //初始化事件相关绑定
            bindEvent = function(){
                var evts = ['start','end','dragging','change'];
                for(var i = 0;i<evts.length; i++){
                    if( opt[ 'on'+evts[i] ] ){
                        sortable.on( evts[ i ] ,opt[ 'on'+evts[i] ] );
                    };
                };

                //在cancel和reset方法中，这些事件会被重绑，所以在这先清除。
                draggable.off('start',handle);
                draggable.off('dragging',ingHandle);
                draggable.off('end',endHandle);

                draggable.on('start',handle);
                draggable.on('dragging',ingHandle);
                draggable.on('end',endHandle);
            },

            getItemAttr = function(){
                itemAttr = [];
                for(var i = 0 , num = item.size(); i< num ; i++){
                    var ele = item.eq(i),
                        w = ele.outerWidth(),
                        h = ele.outerHeight(),
                        o = ele.offset(),

                        //TODO:如果想支持非列表类型，如块类型的并排横着摆放，在此加入left和right判断。
                        // left = {},
                        // right = {},
                        up = {top:o.top,bottom:o.top+h/2,left:o.left,right:o.left+w},
                        down = {top:o.top+h/2,bottom:o.top+h,left:o.left,right:o.left+w};
                    itemAttr.push({id:i,target:ele,up:up,down:down});
                };
            },

            //判断是否碰撞，返回当前碰撞的方位false,up,down,both
            checkCrash = function(area1,area2){
                var up = isCrash(area1.up,area2),
                    down = isCrash(area1.down,area2);
                if(up && down){
                    return 'both';
                }else if(up && !down){
                    return 'up';
                }else if(down && !up){
                    return 'down';
                }else{
                    return false;
                };
            },

            //检测两区域是否碰撞
            isCrash = function(a1,a2){
                if(a1.top>a2.bottom||a1.bottom<a2.top||a1.left>a2.right||a1.right<a2.left){
                    return false;
                }else{
                    return true;
                };
            },

            handle = function(e){
                getItemAttr();
                dragEle = e.target;
                dragEleAttr = {
                    id:dragEle.data('sortable-id'),
                    w:dragEle.outerWidth(),
                    h:dragEle.outerHeight(),
                    zIndex:dragEle.css('z-index')
                };
                sortable.fire('start');
                htmlTemp = me.html().replace(/\stang-draggable-dragging/g,'');

                //清除掉draggable附加的className
                dragEleClone = dragEle.clone();

                //TODO：以后可以考虑根据需求开放clone这个元素的样式
                dragEleClone.addClass('tang-sortable-clone');
                dragEleClone.removeClass('tang-draggable-dragging tang-sortable-item');

                dragEle.after(dragEleClone);
                dragEleClone.css('visibility','hidden');

                //TODO:这里的z-index不应该被硬编码的，需要判断下周边的z-index来设定。
                dragEle.css({'position':'absolute','z-index':200});
                var o = dragEleClone.offset();
                dragEleCloneAttr.left = o.left;
                dragEleCloneAttr.top = o.top;
            },

            ingHandle = function(){

                //这段监听的dragging，dragging已经被函数节流过了。
                var index,position;
                var o = dragEle.offset();
                dragEleAttr.top = o.top;
                dragEleAttr.left = o.left;
                dragEleAttr.bottom = o.top + dragEleAttr.h;
                dragEleAttr.right = o.left + dragEleAttr.w;
                for(var i = 0 ,num = itemAttr.length;i<num;i++){
                    if(itemAttr[i].id != dragEleAttr.id ){
                        position = checkCrash(itemAttr[i],dragEleAttr);
                        if(position == 'up'){
                            itemAttr[i].target.before(dragEleClone);
                        }else if(position == 'down'){
                            itemAttr[i].target.after(dragEleClone);
                        }else if(position == 'both'){
                            //itemAttr[i].target.before(dragEleClone);
                        }else{

                        };
                    };
                };
                sortable.fire('dragging');
            },

            endHandle = function(){
                var o = dragEleClone.offset();
                
                //克隆的元素在原位
                if(o.left == dragEleCloneAttr.left && o.top == dragEleCloneAttr.top){
                }else{
                    htmlCancel = htmlTemp;
                    sortable.fire('change');
                    dragEleClone.after(dragEle);
                };
                dragEle.css({'position':'static',left:'',top:'','z-index':dragEleAttr.zIndex});
                dragEleClone.remove();
                dragEleClone = null;
                sortable.fire('end');
            },

            setOpt = function(opts){
                for(var k in opts){
                    opt[k] = opts[k];
                };
                (opt.enable == false) && sortable.disable();
            },

            //函数主逻辑
            init = function(){

                //函数参数逻辑
                switch(argsNum){

                    //没有传参，默认执行
                    case 0:
                        item = me.children();
                    break;

                    //传入一个参数
                    case 1:
                        if( ebuy361.type(value) == 'object' ){
                            item = me.children();

                            //value是options
                            setOpt(value);
                        }else{
                        
                            //value是selector
                            item = me.find(value);
                        };
                    break;

                    //传入selector和options
                    case 2:

                        //value是selector
                        item = me.find(value);
                        setOpt(opts);
                    break;
                };
                item.addClass('tang-sortable-item');
                draggable = ebuy361(item).draggable().range(opt.range);
                sortable.index('set');
                bindEvent();
            };

        init();
        htmlReset = htmlCancel = me.html();

        //暴露getBack()方法，返回上一级ebuy361Dom链头
        return sortable;
    }
});





 
 
 

(function( undefined ){
    var data = ebuy361.dom.data,

        //ebuy361._util_.access中value不能是fn,所以这里重写一个
        wrapper = function(tang, value, fn, setter){
            var tmp;

            if( !tang.size() ) {
                return tang;
            }
//            return setter || value ? ( tang.each(fn), tang ): fn.call( tmp = tang[0], 0, tmp );
            return setter || value ? tang.each(fn) : fn.call( tmp = tang[0], 0, tmp );
        };

    ebuy361._queueHooks = function(elem, type){
        var key = type + "queueHooks",
            ret;

        return data(elem, key) || (data(elem, key, ret = {
            empty: ebuy361.Callbacks("once memory").add(function(){
                //清理
                data(elem, type + "queue", null);
                data(elem, key, null);
            })
        }), ret);
    }


    ebuy361.plugin( "dom", {
        queue: function( type, value, dontstart ){
            var key;

            if ( typeof type !== "string" ) {
                value = type;
                type = undefined;
            }

            type = type || "fx";
            key = type + "queue";

            return wrapper(this, value, function(){
                var queue = data(this, key);
                if(value){
                    if(!queue || ebuy361.isArray(value)){
                        data( this, key, queue = ebuy361.makeArray( value ) );
                    } else {
                        queue.push( value );
                    }

                    // 确保queue有hooks, 在promise调用之前必须要有hooks
                    ebuy361._queueHooks( this, type );

                    if ( !dontstart && type === "fx" && queue[0] !== "inprogress" ) {
                        ebuy361.dequeue( this, type );
                    }
                }
                return queue || [];
            }, arguments.length > 1 || value);
        },

        dequeue: function( type ){
            type = type || "fx";

            return wrapper(this, true, function(){
                var elem = this,
                    queue = ebuy361.queue(elem, type),
                    remaining = queue.length,
                    fn = queue.shift(),
                    hooks = ebuy361._queueHooks(elem, type),
                    next = function(){
                        ebuy361.dequeue(elem, type);
                    };

                if( fn === "inprogress" ) {
                    fn = queue.shift();
                    remaining--;
                }

                hooks.cur = fn;

                if( fn ) {
                    if( type === "fx" ) {
                        queue.unshift("inprogress");
                    }

                    delete hooks.stop;
                    fn.call(elem, next, hooks);
                }

                !remaining && hooks && hooks.empty.fire();
            });
        }
    });

    //copy queue and dequeue to ebuy361 namespace.
    ebuy361.queue = ebuy361.dom.queue;
    ebuy361.dequeue = ebuy361.dom.dequeue;

})();


 
ebuy361.plugin( "dom", {

    clearQueue: function( type ) {
        return this.queue( type || "fx", [] );
    }
});


ebuy361.plugin( "dom", {

    delay: function( duration, type ){
        type = type || "fx";
        return this.queue(type, function( next, hooks ){
            var timer = setTimeout(next, duration || 0);
            hooks.stop = function(){
                clearTimeout( timer );
            }
        });
    }
});






ebuy361.fx = ebuy361.fx || {};




(function( undefined ){
    var fx = ebuy361.fx,

        //当animation frame不支持时有用
        interval = 13,

        //方法池子
        timers = [],

        getStrategy = (function(){
            var strategies = {
                    _default: {
                        next: function( cb ){
                            return setTimeout( cb, interval );
                        },

                        cancel: function( id ){ //不包一层，在id里面报错
                            return clearTimeout( id );
                        }
                    }
                },

                nextFrame = window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame,

                cancelFrame = window.cancelRequestAnimationFrame ||
                    window.webkitCancelAnimationFrame ||
                    window.webkitCancelRequestAnimationFrame ||
                    window.mozCancelRequestAnimationFrame ||
                    window.oCancelRequestAnimationFrame ||
                    window.msCancelRequestAnimationFrame;

            nextFrame && cancelFrame && (strategies.frame = {
                next: nextFrame,
                cancel: cancelFrame
            });

            return function( stra ){
                return strategies[stra] || strategies._default;
            };
        })(),

        now = function(){
            return ( new Date() ).getTime();
        },

        createFxNow = function(){
            setTimeout(function(){
                fxNow = undefined;
            }, 0);
            return fxNow = now();
        },

        //统一调配
        tick = function(){
            var timer,
                i = 0;

            fxNow = now();//cache 当前时间
            for ( ; i < timers.length; i++ ) {
                timer = timers[ i ];
                // Checks the timer has not already been removed
                if ( !timer() && timers[ i ] === timer ) {
                    timers.splice( i--, 1 );
                }
            }
            if ( !timers.length ) {
                stop();
            } else {
                start( true );
            }
            fxNow = undefined;
        },

        //开始定期执行
        start = function( force ){

            //暴露到fx给测试用例用
            strategy = strategy || ( fx.strategy = getStrategy( fx.useAnimationFrame ? 'frame' : '_default' ) );

            timerId = ( force ? false : timerId ) || strategy.next.call( null, tick );//必须使用call，否则会报错
        },

        //结束定期执行
        stop = function(){
            strategy && strategy.cancel.call( null, timerId );//必须使用call，否则会报错
            timerId = strategy = null;
        },

        //timer ID
        timerId,
        fxNow,
        strategy;


    ebuy361.extend(fx, {

        //添加方法到池子，如果fn有返回值，此方法将在下个tick再次执行。
        //获取池子
        timer: function( fn ){
            if( fn === undefined ){
                return timers;
            }
            fn() && timers.push( fn ) && start();
        },

        //获取当前时间，有缓存机制
        now: function(){
            return fxNow || createFxNow();
        },

        tick: tick,

        useAnimationFrame: true
    });
})();









void function () {
    var css = ebuy361.dom.css,
        cssNumber = ebuy361._util_.cssNumber;

    ebuy361.extend(ebuy361.plugin._util_.fx = {}, {
        cssUnit: function (prop) {
            return cssNumber[prop] ? "" : "px";
        },

        getCss: function (elem, key) {
            var val = css(elem, key),
                num = parseFloat(val);

            return !isNaN(num) && isFinite(num) ? num || 0 : val;
        },

        propExpand: (function () {
            var hooks = {},
                cssExpand = [ "Top", "Right", "Bottom", "Left" ];

            ebuy361.forEach({
                margin: "",
                padding: "",
                border: "Width"
            }, function (suffix, prefix) {
                hooks[ prefix + suffix ] = {
                    expand: function (value) {
                        var i = 0,
                            expanded = {},

                        // assumes a single number if not a string
                            parts = typeof value === "string" ? value.split(" ") : [ value ];

                        for (; i < 4; i++) {
                            expanded[ prefix + cssExpand[ i ] + suffix ] =
                                parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
                        }

                        return expanded;
                    }
                };
            });

            return function (prop, value) {
                var hook = hooks[ prop ];
                return hook ? hook.expand(value) : null;
            }
        })(),

        getAllData: (function () {
            var guid = ebuy361.key
                , maps = ebuy361.global("_maps_HTMLElementData");

            return function (elem) {
                var key = elem[guid];
                return key && maps[key] || [];
            }
        })()
    });


}();




(function( undefined ){

    var fx  = ebuy361.fx,
        helper = ebuy361.plugin._util_.fx,
        css = ebuy361.dom.css,
        cssUnit = helper.cssUnit,
        cssHooks = ebuy361._util_.cssHooks,
        getCss = helper.getCss,
        easing = {
            linear: function( p ) {
                return p;
            },
            swing: function( p ) {
                return 0.5 - Math.cos( p*Math.PI ) / 2;
            }
        };

    function Tween( elem, options, prop, end, easing ) {
        return new Tween.prototype.init( elem, options, prop, end, easing );
    }

    Tween.prototype = {
        constructor: Tween,
        init: function( elem, options, prop, end, easing, unit ) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || cssUnit(prop);
        },
        cur: function() {
            var hooks = Tween.propHooks[ this.prop ];

            return hooks && hooks.get ?
                hooks.get( this ) :
                Tween.propHooks._default.get( this );
        },
        run: function( percent ) {
            var eased,
                hooks = Tween.propHooks[ this.prop ];

            if ( this.options.duration ) {
                this.pos = eased = easing[ this.easing ](
                    percent, this.options.duration * percent, 0, 1, this.options.duration
                );
            } else {
                this.pos = eased = percent;
            }
            this.now = ( this.end - this.start ) * eased + this.start;

            if ( this.options.step ) {
                this.options.step.call( this.elem, this.now, this );
            }

            if ( hooks && hooks.set ) {
                hooks.set( this );
            } else {
                Tween.propHooks._default.set( this );
            }
            return this;
        }
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
        _default: {
            get: function( tween ) {
                var result,
                    elem = tween.elem,
                    style;

                if ( elem[ tween.prop ] != null &&
                    (!( style = elem.style ) || style[ tween.prop ] == null) ) {
                    return elem[ tween.prop ];
                }
                result = getCss( elem, tween.prop );
                return !result || result === "auto" ? 0 : result;
            },

            set: function( tween ) {
                var elem = tween.elem,
                    style = elem.style;

                if ( style && ( style[ tween.prop ] != null || cssHooks[tween.prop] ) ) {
                    css( elem, tween.prop, tween.now + tween.unit );
                } else {
                    elem[ tween.prop ] = tween.now;
                }
            }
        }
    };

    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function( tween ) {
            var elem = tween.elem;
            if ( elem.nodeType && elem.parentNode ) {
                elem[ tween.prop ] = tween.now;
            }
        }
    };


    //expose
    ebuy361.extend(fx, {
        Tween: Tween,
        easing: easing
    });
})();














(function(support){
    var div = document.createElement("div");

    support.inlineBlockNeedsLayout = false;
    support.shrinkWrapBlocks = false;

    ebuy361(document).ready(function(){
        var body = document.body,
            container = document.createElement("div");
        container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

        body.appendChild( container ).appendChild( div );

        if ( typeof div.style.zoom !== "undefined" ) {
            div.style.cssText = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;width:1px;padding:1px;display:inline;zoom:1";
            support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

            // Support: IE6
            // Check if elements with layout shrink-wrap their children
            div.style.display = "block";
            div.innerHTML = "<div></div>";
            div.firstChild.style.width = "5px";
            support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
        }

        body.removeChild( container );
        container = div = body = null;
    });
})(ebuy361._util_.support);

(function( undefined ){

    var fx  = ebuy361.fx,
        helper = ebuy361.plugin._util_.fx,
        cssUnit = helper.cssUnit,
        css = ebuy361.dom.css,
        data = ebuy361.dom.data,
        isHidden = ebuy361._util_.isHidden,
        getCss = helper.getCss,
        propExpand = helper.propExpand,
        toCamelCase = ebuy361.string.toCamelCase,
        fxNow = fx.now,
        rfxtypes = /^(?:toggle|show|hide)$/i,
        rfxnum = /^(?:([+-])=|)([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))([a-z%]*)$/i,
        animationPrefilters = [ defaultPrefilter ],
        tweeners = {
            "*": [function( prop, value ) {
                var end, unit,
                    tween = this.createTween( prop, value ),
                    elem = tween.elem,
                    parts = rfxnum.exec( value ),
                    target = tween.cur(),
                    start = +target || 0,
                    scale = 1,
                    maxIterations = 20;

                if ( parts ) {
                    end = +parts[2];
                    unit = parts[3] || cssUnit( prop );
                    // 统一单位
                    if ( unit !== "px" && start ) {
                        start = getCss( elem, prop ) || end || 1;
                        do {
                            scale = scale || ".5";
                            start = start / scale;
                            css( elem, prop, start + unit );
                        } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
                    }

                    tween.unit = unit;
                    tween.start = start;
                    tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
                }
                return tween;
            }]
        };

    function createTweens( animation, props ) {
        ebuy361.forEach( props, function( value, prop ) {
            var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
                index = 0,
                length = collection.length;
            for ( ; index < length; index++ ) {
                if ( collection[ index ].call( animation, prop, value ) ) {

                    // we're done with this property
                    return;
                }
            }
        });
    }

    function Animation( elem, properties, options ) {
        var result,
            stopped,
            index = 0,
            length = animationPrefilters.length,
            deferred = ebuy361.Deferred().always( function() {
                // don't match elem in the :animated selector
                delete tick.elem;
            }),
            tick = function() {
                if ( stopped ) {
                    return false;
                }
                var currentTime = fxNow(),
                    remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
                // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
                    temp = remaining / animation.duration || 0,
                    percent = 1 - temp,
                    index = 0,
                    length = animation.tweens.length;

                for ( ; index < length ; index++ ) {
                    animation.tweens[ index ].run( percent );
                }

                deferred.notifyWith( elem, [ animation, percent, remaining ]);

                if ( percent < 1 && length ) {
                    return remaining;
                } else {
                    deferred.resolveWith( elem, [ animation ] );
                    return false;
                }
            },
            animation = deferred.promise({
                elem: elem,
                props: ebuy361.extend( {}, properties ),
                opts: ebuy361.extend( true, { specialEasing: {} }, options ),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function( prop, end ) {
                    var tween = fx.Tween( elem, animation.opts, prop, end,
                        animation.opts.specialEasing[ prop ] || animation.opts.easing );
                    animation.tweens.push( tween );
                    return tween;
                },
                stop: function( gotoEnd ) {
                    var index = 0,
                    // if we are going to the end, we want to run all the tweens
                    // otherwise we skip this part
                        length = gotoEnd ? animation.tweens.length : 0;
                    if ( stopped ) {
                        return this;
                    }
                    stopped = true;
                    for ( ; index < length ; index++ ) {
                        animation.tweens[ index ].run( 1 );
                    }

                    deferred[ gotoEnd ? 'resolveWith' : 'rejectWith' ](elem, [ animation, gotoEnd ]);
                    return this;
                }
            }),
            props = animation.props;

        propFilter( props, animation.opts.specialEasing );

        for ( ; index < length ; index++ ) {
            result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
            if ( result ) {
                return result;
            }
        }

        createTweens( animation, props );

        if ( ebuy361.isFunction( animation.opts.start ) ) {
            animation.opts.start.call( elem, animation );
        }

        fx.timer(
            ebuy361.extend( tick, {
                elem: elem,
                anim: animation,
                queue: animation.opts.queue
            })
        );

        // attach callbacks from options
        return animation.progress( animation.opts.progress )
            .done( animation.opts.done, animation.opts.complete )
            .fail( animation.opts.fail )
            .always( animation.opts.always );
    }

    //驼峰化属性名，扩展特殊属性比如padding, borderWidth...
    function propFilter( props, specialEasing ) {
        var value, name, index, easing, expanded;

        for ( index in props ) {
            name = toCamelCase(index);
            easing = specialEasing[ name ];
            value = props[ index ];
            if ( ebuy361.isArray( value ) ) {
                easing = value[ 1 ];
                value = props[ index ] = value[ 0 ];
            }

            if ( index !== name ) {
                props[ name ] = value;
                delete props[ index ];
            }

            expanded = propExpand( name , value );
            if( expanded ) {
                value = expanded;
                delete props[ name ];
                for ( index in value ) {
                    if ( !( index in props ) ) {
                        props[ index ] = value[ index ];
                        specialEasing[ index ] = easing;
                    }
                }
            } else {
                specialEasing[ name ] = easing;
            }
        }
    }

    fx.Animation = ebuy361.extend( Animation, {

        tweener: function( props, callback ) {
            if ( ebuy361.isFunction( props ) ) {
                callback = props;
                props = [ "*" ];
            } else {
                props = props.split(" ");
            }

            var prop,
                index = 0,
                length = props.length;

            for ( ; index < length ; index++ ) {
                prop = props[ index ];
                tweeners[ prop ] = tweeners[ prop ] || [];
                tweeners[ prop ].unshift( callback );
            }
        },

        prefilter: function( callback, prepend ) {
            if ( prepend ) {
                animationPrefilters.unshift( callback );
            } else {
                animationPrefilters.push( callback );
            }
        }
    });


    function defaultPrefilter( elem, props, opts ) {
        
        var prop, index, length,
            value, dataShow, toggle,
            tween, hooks, oldfire,
            anim = this,
            style = elem.style,
            orig = {},
            handled = [],
            hidden = elem.nodeType && isHidden( elem ),
            support = ebuy361._util_.support;

        // handle queue: false promises
        if ( !opts.queue ) {
            hooks = ebuy361._queueHooks( elem, "fx" );
            if ( hooks.unqueued == null ) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function() {
                    if ( !hooks.unqueued ) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;

            anim.always(function() {
                // doing this makes sure that the complete handler will be called
                // before this completes
                anim.always(function() {
                    hooks.unqueued--;
                    if ( !ebuy361.queue( elem, "fx" ).length ) {
                        hooks.empty.fire();
                    }
                });
            });
        }

        // height/width overflow pass
        if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            if ( css( elem, "display" ) === "inline" &&
                css( elem, "float" ) === "none" ) {

                style.display = "inline-block";

                // inline-level elements accept inline-block;
                // block-level elements need to be inline with layout
                if ( !support.inlineBlockNeedsLayout  ) {
                    style.display = "inline-block";
                } else {
                    style.zoom = 1;
                }
            }
        }


        if ( opts.overflow ) {
            style.overflow = "hidden";
            if ( !support.shrinkWrapBlocks ) {
                anim.always(function() {
                    style.overflow = opts.overflow[ 0 ];
                    style.overflowX = opts.overflow[ 1 ];
                    style.overflowY = opts.overflow[ 2 ];
                });
            }
        }
        // show/hide pass
        for ( index in props ) {
            value = props[ index ];
            if ( rfxtypes.exec( value ) ) {
                delete props[ index ];
                toggle = toggle || value === "toggle";
                if ( value === ( hidden ? "hide" : "show" ) ) {
                    continue;
                }
                handled.push( index );
            }
        }

        length = handled.length;
        if ( length ) {
            dataShow = data( elem, "fxshow" );
            dataShow || data( elem, "fxshow", dataShow = {} );
            if ( "hidden" in dataShow ) {
                hidden = dataShow.hidden;
            }

            // store state if its toggle - enables .stop().toggle() to "reverse"
            if ( toggle ) {
                dataShow.hidden = !hidden;
            }
            if ( hidden ) {
                ebuy361.dom( elem ).show();
            } else {
                anim.done(function() {
                    ebuy361.dom( elem ).hide();
                });
            }
            anim.done(function() {
                var prop;
                data( elem, "fxshow", null );
                for ( prop in orig ) {
                    css( elem, prop, orig[ prop ] );
                }
            });
            for ( index = 0 ; index < length ; index++ ) {
                prop = handled[ index ];
                tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
                orig[ prop ] = dataShow[ prop ] || css( elem, prop );

                if ( !( prop in dataShow ) ) {
                    dataShow[ prop ] = tween.start;
                    if ( hidden ) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
        }
    }

})();




 

(function(){
    var fx = ebuy361.fx,
        Animation = fx.Animation,
        data = ebuy361.dom.data,
        speeds = {
            slow: 600,
            fast: 200,
            // Default speed
            _default: 400
        };

    function isEmptyObject( obj ) {
        var name;
        for ( name in obj ) {
            return false;
        }
        return true;
    }

    function parseOpt( speed, easing, fn ) {
        var opt = speed && typeof speed === "object" ? ebuy361.extend( {}, speed ) : {
            complete: fn || !fn && easing ||
                ebuy361.isFunction( speed ) && speed,
            duration: speed,
            easing: fn && easing || easing && !ebuy361.isFunction( easing ) && easing
        };

        opt.duration = fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in speeds ? speeds[ opt.duration ] : speeds._default;

        // normalize opt.queue - true/undefined/null -> "fx"
        if ( opt.queue == null || opt.queue === true ) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function() {
            if ( ebuy361.isFunction( opt.old ) ) {
                opt.old.call( this );
            }

            if ( opt.queue ) {
                ebuy361.dequeue( this, opt.queue );
            }
        };

        return opt;
    };

    ebuy361.plugin('dom', {
        animate: function( prop, speed, easing, callback ) {
            var empty = isEmptyObject( prop ),
                opt = parseOpt( speed, easing, callback ),
                doAnimation = function() {
                    // Operate on a copy of prop so per-property easing won't be lost
                    var anim = Animation( this, ebuy361.extend( {}, prop ), opt );
                    doAnimation.finish = function() {
                        anim.stop( true );
                    };
                    // Empty animations, or finishing resolves immediately
                    if ( empty || data( this, "finish" ) ) {
                        anim.stop( true );
                    }
                };
            doAnimation.finish = doAnimation;

            return empty || opt.queue === false ?
                this.each( doAnimation ) :
                this.queue( opt.queue, doAnimation );
        }
    });

    //expose
    ebuy361.extend(fx, {
        speeds: speeds,
        off: false
    })
})();






(function(){
    var fx = ebuy361.fx,
        helper = ebuy361.plugin._util_.fx,
        getAllData = helper.getAllData;


    ebuy361.plugin( "dom", {
        finish: function( type ) {
            if ( type !== false ) {
                type = type || "fx";
            }
            return this.each( function() {
                var index,
                    data = getAllData( this ),
                    queue = data[ type + "queue" ],
                    hooks = data[ type + "queueHooks" ],
                    timers = fx.timer(),
                    item,
                    length = queue ? queue.length : 0;

                // enable finishing flag on private data
                data.finish = true;

                // empty the queue first
                ebuy361.queue( this, type, [], true );

                if ( hooks && hooks.cur && hooks.cur.finish ) {
                    hooks.cur.finish.call( this );
                }

                // look for any active animations, and finish them
                for ( index = timers.length; index--; ) {
                    item = timers[ index ];
                    if ( item.elem === this && item.queue === type ) {
                        item.anim.stop( true );
                        timers.splice( index, 1 );
                    }
                }

                // look for any animations in the old queue and finish them
                for ( index = 0; index < length; index++ ) {
                    item = queue[ index ];
                    if ( item && item.finish ) {
                        item.finish.call( this );
                    }
                }

                // turn off finishing flag
                delete data.finish;
            } );
        }
    } );
})();







 
(function(){
    var fx = ebuy361.fx,
        helper = ebuy361.plugin._util_.fx,
        rrun = /queueHooks$/,
        getAllData = helper.getAllData;

    ebuy361.plugin( "dom", {
        stop: function( type, clearQueue, gotoEnd ) {
            var stopQueue = function( hooks ) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop( gotoEnd );
            };

            if ( typeof type !== "string" ) {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if ( clearQueue && type !== false ) {
                this.queue( type || "fx", [] );
            }

            return this.each(function() {
                var dequeue = true,
                    index = type != null && type + "queueHooks",
                    timers = fx.timer(),
                    data = getAllData( this );

                if ( index ) {
                    if ( data[ index ] && data[ index ].stop ) {
                        stopQueue( data[ index ] );
                    }
                } else {
                    for ( index in data ) {
                        if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
                            stopQueue( data[ index ] );
                        }
                    }
                }

                for ( index = timers.length; index--; ) {
                    if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
                        timers[ index ].anim.stop( gotoEnd );
                        dequeue = false;
                        timers.splice( index, 1 );
                    }
                }

                // start the next in the queue if the last step wasn't forced
                // timers currently will call their complete callbacks, which will dequeue
                // but only if they were gotoEnd
                if ( dequeue || !gotoEnd ) {
                    ebuy361.dequeue( this, type );
                }
            });
        }
    });
})();





 
 
 

 
 
 
 
 

// Slide
// ---------------------------------------

 
 
 

 
 
 
 
 
(function(){
    var isHidden = ebuy361._util_.isHidden,
        cssExpand = [ "Top", "Right", "Bottom", "Left" ],
        presets = {};

    // Generate parameters to create a standard animation
    function genFx( type, includeWidth ) {
        var which,
            attrs = { height: type },
            i = 0;

        // if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth? 1 : 0;
        for( ; i < 4 ; i += 2 - includeWidth ) {
            which = cssExpand[ i ];
            attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
        }

        if ( includeWidth ) {
            attrs.opacity = attrs.width = type;
        }

        return attrs;
    }

    // Generate shortcuts for custom animations
    ebuy361.forEach({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function( props, name ) {
        presets[ name ] = function( speed, easing, callback ) {
            return this.animate( props, speed, easing, callback );
        };
    });

    ebuy361.forEach([ "toggle", "show", "hide" ], function( name, i ) {
        var cssFn = ebuy361.dom.fn[ name ];
        presets[ name ] = function( speed, easing, callback ) {
            return speed == null || typeof speed === "boolean" ?
                cssFn ? cssFn.apply( this, arguments ) : this :
                this.animate( genFx( name, true ), speed, easing, callback );
        };
    });

    presets.fadeTo = function( speed, to, easing, callback ) {

        this.filter(function(){
            return isHidden(this);
        }).css( "opacity", 0 ).show();
        return this.animate({ opacity: to }, speed, easing, callback );
    }

    ebuy361.plugin( "dom", presets );
})();








void function( window, undefined ) {


 //在用户选择使用 Sizzle 时会被覆盖原有简化版本的ebuy361.query方法

    ebuy361.query = function( selector, context, results ) {
        return ebuy361.merge( results || [], ebuy361.sizzle(selector, context) );
    };

    var document = window.document,
        docElem = document.documentElement,

        expando = "sizcache" + (Math.random() + '').replace('.', ''),
        done = 0,

        toString = Object.prototype.toString,
        strundefined = "undefined",

        hasDuplicate = false,
        baseHasDuplicate = true,

        // Regex
        rquickExpr = /^#([\w\-]+$)|^(\w+$)|^\.([\w\-]+$)/,
        chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,

        rbackslash = /\\/g,
        rnonWord = /\W/,
        rstartsWithWord = /^\w/,
        rnonDigit = /\D/,
        rnth = /(-?)(\d*)(?:n([+\-]?\d*))?/,
        radjacent = /^\+|\s*/g,
        rheader = /h\d/i,
        rinputs = /input|select|textarea|button/i,
        rtnfr = /[\t\n\f\r]/g,

        characterEncoding = "(?:[-\\w]|[^\\x00-\\xa0]|\\\\.)",
        matchExpr = {
            ID: new RegExp("#(" + characterEncoding + "+)"),
            CLASS: new RegExp("\\.(" + characterEncoding + "+)"),
            NAME: new RegExp("\\[name=['\"]*(" + characterEncoding + "+)['\"]*\\]"),
            TAG: new RegExp("^(" + characterEncoding.replace( "[-", "[-\\*" ) + "+)"),
            ATTR: new RegExp("\\[\\s*(" + characterEncoding + "+)\\s*(?:(\\S?=)\\s*(?:(['\"])(.*?)\\3|(#?" + characterEncoding + "*)|)|)\\s*\\]"),
            PSEUDO: new RegExp(":(" + characterEncoding + "+)(?:\\((['\"]?)((?:\\([^\\)]+\\)|[^\\(\\)]*)+)\\2\\))?"),
            CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/
        },

        origPOS = matchExpr.POS,

        leftMatchExpr = (function() {
            var type,
                // Increments parenthetical references
                // for leftMatch creation
                fescape = function( all, num ) {
                    return "\\" + ( num - 0 + 1 );
                },
                leftMatch = {};

            for ( type in matchExpr ) {
                // Modify the regexes ensuring the matches do not end in brackets/parens
                matchExpr[ type ] = new RegExp( matchExpr[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
                // Adds a capture group for characters left of the match
                leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + matchExpr[ type ].source.replace( /\\(\d+)/g, fescape ) );
            }

            // Expose origPOS
            // "global" as in regardless of relation to brackets/parens
            matchExpr.globalPOS = origPOS;

            return leftMatch;
        })(),

        // Used for testing something on an element
        assert = function( fn ) {
            var pass = false,
                div = document.createElement("div");
            try {
                pass = fn( div );
            } catch (e) {}
            // release memory in IE
            div = null;
            return pass;
        },

        // Check to see if the browser returns elements by name when
        // querying by getElementById (and provide a workaround)
        assertGetIdNotName = assert(function( div ) {
            var pass = true,
                id = "script" + (new Date()).getTime();
            div.innerHTML = "<a name ='" + id + "'/>";

            // Inject it into the root element, check its status, and remove it quickly
            docElem.insertBefore( div, docElem.firstChild );

            if ( document.getElementById( id ) ) {
                pass = false;
            }
            docElem.removeChild( div );
            return pass;
        }),

        // Check to see if the browser returns only elements
        // when doing getElementsByTagName("*")
        assertTagNameNoComments = assert(function( div ) {
            div.appendChild( document.createComment("") );
            return div.getElementsByTagName("*").length === 0;
        }),

        // Check to see if an attribute returns normalized href attributes
        assertHrefNotNormalized = assert(function( div ) {
            div.innerHTML = "<a href='#'></a>";
            return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
                div.firstChild.getAttribute("href") === "#";
        }),

        // Determines a buggy getElementsByClassName
        assertUsableClassName = assert(function( div ) {
            // Opera can't find a second classname (in 9.6)
            div.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
                return false;
            }

            // Safari caches class attributes, doesn't catch changes (in 3.2)
            div.lastChild.className = "e";
            return div.getElementsByClassName("e").length !== 1;
        });


    // Check if the JavaScript engine is using some sort of
    // optimization where it does not always call our comparision
    // function. If that is the case, discard the hasDuplicate value.
    //   Thus far that includes Google Chrome.
    [0, 0].sort(function() {
        baseHasDuplicate = false;
        return 0;
    });

    var Sizzle = function( selector, context, results ) {
        results = results || [];
        context = context || document;
        var match, elem, contextXML,
            nodeType = context.nodeType;

        if ( nodeType !== 1 && nodeType !== 9 ) {
            return [];
        }

        if ( !selector || typeof selector !== "string" ) {
            return results;
        }else{
            selector = ebuy361.string(selector).trim();
            if(!selector){return results;};
        }

        contextXML = isXML( context );

        if ( !contextXML ) {
            if ( (match = rquickExpr.exec( selector )) ) {
                // Speed-up: Sizzle("#ID")
                if ( match[1] ) {
                    if ( nodeType === 9 ) {
                        elem = context.getElementById( match[1] );
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if ( elem && elem.parentNode ) {
                            // Handle the case where IE, Opera, and Webkit return items
                            // by name instead of ID
                            if ( elem.id === match[1] ) {
                                return makeArray( [ elem ], results );
                            }
                        } else {
                            return makeArray( [], results );
                        }
                    } else {
                        // Context is not a document
                        if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( match[1] )) &&
                            contains( context, elem ) && elem.id === match[1] ) {
                            return makeArray( [ elem ], results );
                        }
                    }

                // Speed-up: Sizzle("TAG")
                } else if ( match[2] ) {
                    // Speed-up: Sizzle("body")
                    if ( selector === "body" && context.body ) {
                        return makeArray( [ context.body ], results );
                    }
                    return makeArray( context.getElementsByTagName( selector ), results );
                // Speed-up: Sizzle(".CLASS")
                } else if ( assertUsableClassName && match[3] && context.getElementsByClassName ) {
                    return makeArray( context.getElementsByClassName( match[3] ), results );
                }
            }
        }

        // All others
        return select( selector, context, results, undefined, contextXML );
    };

    var select = function( selector, context, results, seed, contextXML ) {
        var m, set, checkSet, extra, ret, cur, pop, i,
            origContext = context,
            prune = true,
            parts = [],
            soFar = selector;

        do {
            // Reset the position of the chunker regexp (start from head)
            chunker.exec( "" );
            m = chunker.exec( soFar );

            if ( m ) {
                soFar = m[3];

                parts.push( m[1] );

                if ( m[2] ) {
                    extra = m[3];
                    break;
                }
            }
        } while ( m );

        if ( parts.length > 1 && origPOS.exec( selector ) ) {

            if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
                set = posProcess( parts[0] + parts[1], context, seed, contextXML );

            } else {
                set = Expr.relative[ parts[0] ] ?
                    [ context ] :
                    Sizzle( parts.shift(), context );

                while ( parts.length ) {
                    selector = parts.shift();

                    if ( Expr.relative[ selector ] ) {
                        selector += parts.shift();
                    }

                    set = posProcess( selector, set, seed, contextXML );
                }
            }

        } else {
            // Take a shortcut and set the context if the root selector is an ID
            // (but not if it'll be faster if the inner selector is an ID)
            if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
                    matchExpr.ID.test( parts[0] ) && !matchExpr.ID.test( parts[parts.length - 1] ) ) {

                ret = find( parts.shift(), context, contextXML );
                context = ret.expr ?
                    filter( ret.expr, ret.set )[0] :
                    ret.set[0];
            }

            if ( context ) {
                ret = seed ?
                    { expr: parts.pop(), set: makeArray( seed ) } :
                    find( parts.pop(), (parts.length >= 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode) || context, contextXML );

                set = ret.expr ?
                    filter( ret.expr, ret.set ) :
                    ret.set;

                if ( parts.length > 0 ) {
                    checkSet = makeArray( set );

                } else {
                    prune = false;
                }

                while ( parts.length ) {
                    cur = parts.pop();
                    pop = cur;

                    if ( !Expr.relative[ cur ] ) {
                        cur = "";
                    } else {
                        pop = parts.pop();
                    }

                    if ( pop == null ) {
                        pop = context;
                    }

                    Expr.relative[ cur ]( checkSet, pop, contextXML );
                }

            } else {
                checkSet = parts = [];
            }
        }

        if ( !checkSet ) {
            checkSet = set;
        }

        if ( !checkSet ) {
            error( cur || selector );
        }

        if ( toString.call(checkSet) === "[object Array]" ) {
            if ( !prune ) {
                results.push.apply( results, checkSet );

            } else if ( context && context.nodeType === 1 ) {
                for ( i = 0; checkSet[i] != null; i++ ) {
                    if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains( context, checkSet[i] )) ) {
                        results.push( set[i] );
                    }
                }

            } else {
                for ( i = 0; checkSet[i] != null; i++ ) {
                    if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
                        results.push( set[i] );
                    }
                }
            }

        } else {
            makeArray( checkSet, results );
        }

        if ( extra ) {
            select( extra, origContext, results, seed, contextXML );
            uniqueSort( results );
        }

        return results;
    };

    var isXML = ebuy361._util_.isXML;
    //var isXML = Sizzle.isXML = function( elem ) {
    //    // documentElement is verified for cases where it doesn't yet exist
    //    // (such as loading iframes in IE - #4833)
    //    var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
    //    return documentElement ? documentElement.nodeName !== "HTML" : false;
    //};

    // Slice is no longer used
    // It is not actually faster
    // Results is expected to be an array or undefined
    // typeof len is checked for if array is a form nodelist containing an element with name "length" (wow)
    //var makeArray = function( array, results ) {
    //    results = results || [];
    //    var i = 0,
    //        len = array.length;
    //    if ( typeof len === "number" ) {
    //        for ( ; i < len; i++ ) {
    //            results.push( array[i] );
    //        }
    //    } else {
    //        for ( ; array[i]; i++ ) {
    //            results.push( array[i] );
    //        }
    //    }
    //    return results;
    //};
    var makeArray = ebuy361.makeArray;

    var uniqueSort = function( results ) {
        if ( sortOrder ) {
            hasDuplicate = baseHasDuplicate;
            results.sort( sortOrder );

            if ( hasDuplicate ) {
                for ( var i = 1; i < results.length; i++ ) {
                    if ( results[i] === results[ i - 1 ] ) {
                        results.splice( i--, 1 );
                    }
                }
            }
        }

        return results;
    };

    // Element contains another
    //var contains = Sizzle.contains = docElem.compareDocumentPosition ?
    //    function( a, b ) {
    //        return !!(a.compareDocumentPosition( b ) & 16);
    //    } :
    //    docElem.contains ?
    //    function( a, b ) {
    //        return a !== b && ( a.contains ? a.contains( b ) : false );
    //    } :
    //    function( a, b ) {
    //        while ( (b = b.parentNode) ) {
    //            if ( b === a ) {
    //                return true;
    //            }
    //        }
    //        return false;
    //    };
    var contains = ebuy361._util_.contains;


    // Sizzle.matchesSelector = function( node, expr ) {
    //     return select( expr, document, [], [ node ], isXML( document ) ).length > 0;
    // };

    var find = function( expr, context, contextXML ) {
        var set, i, len, match, type, left;

        if ( !expr ) {
            return [];
        }

        for ( i = 0, len = Expr.order.length; i < len; i++ ) {
            type = Expr.order[i];

            if ( (match = leftMatchExpr[ type ].exec( expr )) ) {
                left = match[1];
                match.splice( 1, 1 );

                if ( left.substr( left.length - 1 ) !== "\\" ) {
                    match[1] = (match[1] || "").replace( rbackslash, "" );
                    set = Expr.find[ type ]( match, context, contextXML );

                    if ( set != null ) {
                        expr = expr.replace( matchExpr[ type ], "" );
                        break;
                    }
                }
            }
        }

        if ( !set ) {
            set = typeof context.getElementsByTagName !== strundefined ?
                context.getElementsByTagName( "*" ) :
                [];
        }

        return { set: set, expr: expr };
    };

    var filter = function( expr, set, inplace, not ) {
        var match, anyFound,
            type, found, item, filter, left,
            i, pass,
            old = expr,
            result = [],
            curLoop = set,
            isXMLFilter = set && set[0] && isXML( set[0] );

        while ( expr && set.length ) {
            for ( type in Expr.filter ) {
                if ( (match = leftMatchExpr[ type ].exec( expr )) != null && match[2] ) {
                    filter = Expr.filter[ type ];
                    left = match[1];

                    anyFound = false;

                    match.splice( 1, 1 );

                    if ( left.substr( left.length - 1 ) === "\\" ) {
                        continue;
                    }

                    if ( curLoop === result ) {
                        result = [];
                    }

                    if ( Expr.preFilter[ type ] ) {
                        match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

                        if ( !match ) {
                            anyFound = found = true;

                        } else if ( match === true ) {
                            continue;
                        }
                    }

                    if ( match ) {
                        for ( i = 0; (item = curLoop[i]) != null; i++ ) {
                            if ( item ) {
                                found = filter( item, match, i, curLoop );
                                pass = not ^ found;

                                if ( inplace && found != null ) {
                                    if ( pass ) {
                                        anyFound = true;

                                    } else {
                                        curLoop[i] = false;
                                    }

                                } else if ( pass ) {
                                    result.push( item );
                                    anyFound = true;
                                }
                            }
                        }
                    }

                    if ( found !== undefined ) {
                        if ( !inplace ) {
                            curLoop = result;
                        }

                        expr = expr.replace( matchExpr[ type ], "" );

                        if ( !anyFound ) {
                            return [];
                        }

                        break;
                    }
                }
            }

            // Improper expression
            if ( expr === old ) {
                if ( anyFound == null ) {
                    error( expr );

                } else {
                    break;
                }
            }

            old = expr;
        }

        return curLoop;
    };

    var error = function( msg ) {
        throw new Error( msg );
    };

    
    var getText = function( elem ) {
        var i, node,
            nodeType = elem.nodeType,
            ret = "";

        if ( nodeType ) {
            if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
                // Use textContent for elements
                // innerText usage removed for consistency of new lines (see #11153)
                if ( typeof elem.textContent === "string" ) {
                    return elem.textContent;
                } else {
                    // Traverse it's children
                    for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                        ret += getText( elem );
                    }
                }
            } else if ( nodeType === 3 || nodeType === 4 ) {
                return elem.nodeValue;
            }
        } else {

            // If no nodeType, this is expected to be an array
            for ( i = 0; (node = elem[i]); i++ ) {
                // Do not traverse comment nodes
                if ( node.nodeType !== 8 ) {
                    ret += getText( node );
                }
            }
        }
        return ret;
    };

    var Expr = {

        match: matchExpr,
        leftMatch: leftMatchExpr,

        order: [ "ID", "NAME", "TAG" ],

        attrMap: {
            "class": "className",
            "for": "htmlFor"
        },

        attrHandle: {
            href: assertHrefNotNormalized ?
                function( elem ) {
                    return elem.getAttribute( "href" );
                } :
                function( elem ) {
                    return elem.getAttribute( "href", 2 );
                },
            type: function( elem ) {
                return elem.getAttribute( "type" );
            }
        },

        relative: {
            "+": function( checkSet, part ) {
                var isPartStr = typeof part === "string",
                    isTag = isPartStr && !rnonWord.test( part ),
                    isPartStrNotTag = isPartStr && !isTag;

                if ( isTag ) {
                    part = part.toLowerCase();
                }

                for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
                    if ( (elem = checkSet[i]) ) {
                        while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

                        checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                            elem || false :
                            elem === part;
                    }
                }

                if ( isPartStrNotTag ) {
                    filter( part, checkSet, true );
                }
            },

            ">": function( checkSet, part ) {
                var elem,
                    isPartStr = typeof part === "string",
                    i = 0,
                    l = checkSet.length;

                if ( isPartStr && !rnonWord.test( part ) ) {
                    part = part.toLowerCase();

                    for ( ; i < l; i++ ) {
                        elem = checkSet[i];

                        if ( elem ) {
                            var parent = elem.parentNode;
                            checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                        }
                    }

                } else {
                    for ( ; i < l; i++ ) {
                        elem = checkSet[i];

                        if ( elem ) {
                            checkSet[i] = isPartStr ?
                                elem.parentNode :
                                elem.parentNode === part;
                        }
                    }

                    if ( isPartStr ) {
                        filter( part, checkSet, true );
                    }
                }
            },

            "": function( checkSet, part, xml ) {
                dirCheck( "parentNode", checkSet, part, xml );
            },

            "~": function( checkSet, part, xml ) {
                dirCheck( "previousSibling", checkSet, part, xml );
            }
        },

        find: {
            ID: assertGetIdNotName ?
                function( match, context, xml ) {
                    if ( typeof context.getElementById !== strundefined && !xml ) {
                        var m = context.getElementById( match[1] );
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                } :
                function( match, context, xml ) {
                    if ( typeof context.getElementById !== strundefined && !xml ) {
                        var m = context.getElementById( match[1] );

                        return m ?
                            m.id === match[1] || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").nodeValue === match[1] ?
                                [m] :
                                undefined :
                            [];
                    }
                },

            NAME: function( match, context ) {
                if ( typeof context.getElementsByName !== strundefined ) {
                    var ret = [],
                        results = context.getElementsByName( match[1] ),
                        i = 0,
                        len = results.length;

                    for ( ; i < len; i++ ) {
                        if ( results[i].getAttribute("name") === match[1] ) {
                            ret.push( results[i] );
                        }
                    }

                    return ret.length === 0 ? null : ret;
                }
            },

            TAG: assertTagNameNoComments ?
                function( match, context ) {
                    if ( typeof context.getElementsByTagName !== strundefined ) {
                        return context.getElementsByTagName( match[1] );
                    }
                } :
                function( match, context ) {
                    var results = context.getElementsByTagName( match[1] );

                    // Filter out possible comments
                    if ( match[1] === "*" ) {
                        var tmp = [],
                            i = 0;

                        for ( ; results[i]; i++ ) {
                            if ( results[i].nodeType === 1 ) {
                                tmp.push( results[i] );
                            }
                        }

                        results = tmp;
                    }
                    return results;
                }
        },

        preFilter: {
            CLASS: function( match, curLoop, inplace, result, not, xml ) {
                match = " " + match[1].replace( rbackslash, "" ) + " ";

                if ( xml ) {
                    return match;
                }

                for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
                    if ( elem ) {
                        if ( not ^ (elem.className && ~(" " + elem.className + " ").replace( rtnfr, " " ).indexOf( match ) ) ) {
                            if ( !inplace ) {
                                result.push( elem );
                            }

                        } else if ( inplace ) {
                            curLoop[i] = false;
                        }
                    }
                }

                return false;
            },

            ID: function( match ) {
                return match[1].replace( rbackslash, "" );
            },

            TAG: function( match, curLoop ) {
                return match[1].replace( rbackslash, "" ).toLowerCase();
            },

            CHILD: function( match ) {
                if ( match[1] === "nth" ) {
                    if ( !match[2] ) {
                        error( match[0] );
                    }

                    match[2] = match[2].replace( radjacent, "" );

                    // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                    var test = rnth.exec(
                        match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                        !rnonDigit.test( match[2] ) && "0n+" + match[2] || match[2] );

                    // calculate the numbers (first)n+(last) including if they are negative
                    match[2] = (test[1] + (test[2] || 1)) - 0;
                    match[3] = test[3] - 0;
                } else if ( match[2] ) {
                    error( match[0] );
                }

                // TODO: Move to normal caching system
                match[0] = done++;

                return match;
            },

            ATTR: function( match, curLoop, inplace, result, not, xml ) {
                var name = match[1] = match[1].replace( rbackslash, "" );

                if ( !xml && Expr.attrMap[ name ] ) {
                    match[1] = Expr.attrMap[ name ];
                }

                // Handle if an un-quoted value was used
                match[4] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

                if ( match[2] === "~=" ) {
                    match[4] = " " + match[4] + " ";
                }

                return match;
            },

            PSEUDO: function( match, curLoop, inplace, result, not, xml ) {
                if ( match[1] === "not" ) {
                    // If we're dealing with a complex expression, or a simple one
                    if ( ( chunker.exec( match[3] ) || "" ).length > 1 || rstartsWithWord.test( match[3] ) ) {
                        match[3] = select( match[3], document, [], curLoop, xml );

                    } else {
                        var ret = filter( match[3], curLoop, inplace, !not );

                        if ( !inplace ) {
                            result.push.apply( result, ret );
                        }

                        return false;
                    }

                } else if ( matchExpr.POS.test( match[0] ) || matchExpr.CHILD.test( match[0] ) ) {
                    return true;
                }

                return match;
            },

            POS: function( match ) {
                match.unshift( true );

                return match;
            }
        },

        filters: {
            enabled: function( elem ) {
                return elem.disabled === false;
            },

            disabled: function( elem ) {
                return elem.disabled === true;
            },

            checked: function( elem ) {
                // In CSS3, :checked should return both checked and selected elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                var nodeName = elem.nodeName.toLowerCase();
                return (nodeName === "input" && !! elem.checked) || (nodeName === "option" && !!elem.selected);
            },

            selected: function( elem ) {
                // Accessing this property makes selected-by-default
                // options in Safari work properly
                if ( elem.parentNode ) {
                    elem.parentNode.selectedIndex;
                }

                return elem.selected === true;
            },

            parent: function( elem ) {
                return !!elem.firstChild;
            },

            empty: function( elem ) {
                return !elem.firstChild;
            },

            has: function( elem, i, match ) {
                return !!Sizzle( match[3], elem ).length;
            },

            header: function( elem ) {
                return rheader.test( elem.nodeName );
            },

            text: function( elem ) {
                var attr = elem.getAttribute( "type" ), type = elem.type;
                // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                // use getAttribute instead to test this case
                return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === null || attr.toLowerCase() === type );
            },

            radio: function( elem ) {
                return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
            },

            checkbox: function( elem ) {
                return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
            },

            file: function( elem ) {
                return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
            },

            password: function( elem ) {
                return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
            },

            submit: function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && "submit" === elem.type;
            },

            image: function( elem ) {
                return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
            },

            reset: function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && "reset" === elem.type;
            },

            button: function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && "button" === elem.type || name === "button";
            },

            input: function( elem ) {
                return rinputs.test( elem.nodeName );
            },

            focus: function( elem ) {
                var doc = elem.ownerDocument;
                return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
            },

            active: function( elem ) {
                return elem === elem.ownerDocument.activeElement;
            },

            contains: function( elem, i, match ) {
                return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( match[3] ) >= 0;
            }
        },

        setFilters: {
            first: function( elem, i ) {
                return i === 0;
            },

            last: function( elem, i, match, array ) {
                return i === array.length - 1;
            },

            even: function( elem, i ) {
                return i % 2 === 0;
            },

            odd: function( elem, i ) {
                return i % 2 === 1;
            },

            lt: function( elem, i, match ) {
                return i < match[3] - 0;
            },

            gt: function( elem, i, match ) {
                return i > match[3] - 0;
            },

            nth: function( elem, i, match ) {
                return match[3] - 0 === i;
            },

            eq: function( elem, i, match ) {
                return match[3] - 0 === i;
            }
        },

        filter: {
            PSEUDO: function( elem, match, i, array ) {
                var name = match[1],
                    filter = Expr.filters[ name ];

                if ( filter ) {
                    return filter( elem, i, match, array );

                } else if ( name === "not" ) {
                    var not = match[3],
                        j = 0,
                        len = not.length;

                    for ( ; j < len; j++ ) {
                        if ( not[j] === elem ) {
                            return false;
                        }
                    }

                    return true;

                } else {
                    error( name );
                }
            },

            CHILD: function( elem, match ) {
                var first, last,
                    doneName, parent, cache,
                    count, diff,
                    type = match[1],
                    node = elem;

                switch ( type ) {
                    case "only":
                    case "first":
                        while ( (node = node.previousSibling) ) {
                            if ( node.nodeType === 1 ) {
                                return false;
                            }
                        }

                        if ( type === "first" ) {
                            return true;
                        }

                        node = elem;

                        
                    case "last":
                        while ( (node = node.nextSibling) ) {
                            if ( node.nodeType === 1 ) {
                                return false;
                            }
                        }

                        return true;

                    case "nth":
                        first = match[2];
                        last = match[3];

                        if ( first === 1 && last === 0 ) {
                            return true;
                        }

                        doneName = match[0];
                        parent = elem.parentNode;

                        if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
                            count = 0;

                            for ( node = parent.firstChild; node; node = node.nextSibling ) {
                                if ( node.nodeType === 1 ) {
                                    node.nodeIndex = ++count;
                                }
                            }

                            parent[ expando ] = doneName;
                        }

                        diff = elem.nodeIndex - last;

                        if ( first === 0 ) {
                            return diff === 0;

                        } else {
                            return ( diff % first === 0 && diff / first >= 0 );
                        }
                }
            },

            ID: assertGetIdNotName ?
                function( elem, match ) {
                    return elem.nodeType === 1 && elem.getAttribute("id") === match;
                } :
                function( elem, match ) {
                    var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                    return elem.nodeType === 1 && node && node.nodeValue === match;
                },

            TAG: function( elem, match ) {
                return ( match === "*" && elem.nodeType === 1 ) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
            },

            CLASS: function( elem, match ) {
                return ( " " + ( elem.className || elem.getAttribute("class") ) + " " ).indexOf( match ) > -1;
            },

            ATTR: function( elem, match ) {
                var name = match[1],
                    result = Expr.attrHandle[ name ] ?
                        Expr.attrHandle[ name ]( elem ) :
                        elem[ name ] != null ?
                            elem[ name ] :
                            elem.getAttribute( name ),
                    value = result + "",
                    type = match[2],
                    check = match[4];

                return result == null ?
                    type === "!=" :
                    // !type && Sizzle.attr ?
                    // result != null :
                    type === "=" ?
                    value === check :
                    type === "*=" ?
                    value.indexOf( check ) >= 0 :
                    type === "~=" ?
                    ( " " + value + " " ).indexOf( check ) >= 0 :
                    !check ?
                    value && result !== false :
                    type === "!=" ?
                    value !== check :
                    type === "^=" ?
                    value.indexOf( check ) === 0 :
                    type === "$=" ?
                    value.substr( value.length - check.length ) === check :
                    type === "|=" ?
                    value === check || value.substr( 0, check.length + 1 ) === check + "-" :
                    false;
            },

            POS: function( elem, match, i, array ) {
                var name = match[2],
                    filter = Expr.setFilters[ name ];

                if ( filter ) {
                    return filter( elem, i, match, array );
                }
            }
        }
    };

    // Add getElementsByClassName if usable
    if ( assertUsableClassName ) {
        Expr.order.splice( 1, 0, "CLASS" );
        Expr.find.CLASS = function( match, context, xml ) {
            if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
                return context.getElementsByClassName( match[1] );
            }
        };
    }

    var sortOrder, siblingCheck;

    if ( docElem.compareDocumentPosition ) {
        sortOrder = function( a, b ) {
            if ( a === b ) {
                hasDuplicate = true;
                return 0;
            }

            if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
                return a.compareDocumentPosition ? -1 : 1;
            }

            return a.compareDocumentPosition(b) & 4 ? -1 : 1;
        };

    } else {
        sortOrder = function( a, b ) {
            // The nodes are identical, we can exit early
            if ( a === b ) {
                hasDuplicate = true;
                return 0;

            // Fallback to using sourceIndex (in IE) if it's available on both nodes
            } else if ( a.sourceIndex && b.sourceIndex ) {
                return a.sourceIndex - b.sourceIndex;
            }

            var al, bl,
                ap = [],
                bp = [],
                aup = a.parentNode,
                bup = b.parentNode,
                cur = aup;

            // If the nodes are siblings (or identical) we can do a quick check
            if ( aup === bup ) {
                return siblingCheck( a, b );

            // If no parents were found then the nodes are disconnected
            } else if ( !aup ) {
                return -1;

            } else if ( !bup ) {
                return 1;
            }

            // Otherwise they're somewhere else in the tree so we need
            // to build up a full list of the parentNodes for comparison
            while ( cur ) {
                ap.unshift( cur );
                cur = cur.parentNode;
            }

            cur = bup;

            while ( cur ) {
                bp.unshift( cur );
                cur = cur.parentNode;
            }

            al = ap.length;
            bl = bp.length;

            // Start walking down the tree looking for a discrepancy
            for ( var i = 0; i < al && i < bl; i++ ) {
                if ( ap[i] !== bp[i] ) {
                    return siblingCheck( ap[i], bp[i] );
                }
            }

            // We ended someplace up the tree so do a sibling check
            return i === al ?
                siblingCheck( a, bp[i], -1 ) :
                siblingCheck( ap[i], b, 1 );
        };

        siblingCheck = function( a, b, ret ) {
            if ( a === b ) {
                return ret;
            }

            var cur = a.nextSibling;

            while ( cur ) {
                if ( cur === b ) {
                    return -1;
                }

                cur = cur.nextSibling;
            }

            return 1;
        };
    }

    if ( document.querySelectorAll ) {
        (function(){
            var oldSelect = select,
                id = "__sizzle__",
                rrelativeHierarchy = /^\s*[+~]/,
                rapostrophe = /'/g,
                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                rbuggyQSA = [];

            assert(function( div ) {
                div.innerHTML = "<select><option selected></option></select>";

                // IE8 - Some boolean attributes are not treated correctly
                if ( !div.querySelectorAll("[selected]").length ) {
                    rbuggyQSA.push("\\[[\\x20\\t\\n\\r\\f]*(?:checked|disabled|ismap|multiple|readonly|selected|value)");
                }

                // Webkit/Opera - :checked should return selected option elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                // IE8 throws error here (do not put tests after this one)
                if ( !div.querySelectorAll(":checked").length ) {
                    rbuggyQSA.push(":checked");
                }
            });

            assert(function( div ) {

                // Opera 10/IE - ^= $= *= and empty values
                div.innerHTML = "<p class=''></p>";
                // Should not select anything
                if ( div.querySelectorAll("[class^='']").length ) {
                    rbuggyQSA.push("[*^$]=[\\x20\\t\\n\\r\\f]*(?:\"\"|'')");
                }

                // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                // IE8 throws error here (do not put tests after this one)
                div.innerHTML = "<input type='hidden'>";
                if ( !div.querySelectorAll(":enabled").length ) {
                    rbuggyQSA.push(":enabled", ":disabled");
                }
            });

            rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );

            select = function( selector, context, results, seed, contextXML ) {
                // Only use querySelectorAll when not filtering,
                // when this is not xml,
                // and when no QSA bugs apply
                if ( !seed && !contextXML && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
                    if ( context.nodeType === 9 ) {
                        try {
                            return makeArray( context.querySelectorAll( selector ), results );
                        } catch(qsaError) {}
                    // qSA works strangely on Element-rooted queries
                    // We can work around this by specifying an extra ID on the root
                    // and working up from there (Thanks to Andrew Dupont for the technique)
                    // IE 8 doesn't work on object elements
                    } else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                        var oldContext = context,
                            old = context.getAttribute( "id" ),
                            nid = old || id,
                            parent = context.parentNode,
                            relativeHierarchySelector = rrelativeHierarchy.test( selector );

                        if ( !old ) {
                            context.setAttribute( "id", nid );
                        } else {
                            nid = nid.replace( rapostrophe, "\\$&" );
                        }
                        if ( relativeHierarchySelector && parent ) {
                            context = parent;
                        }

                        try {
                            if ( !relativeHierarchySelector || parent ) {
                                return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + selector ), results );
                            }
                        } catch(qsaError) {
                        } finally {
                            if ( !old ) {
                                oldContext.removeAttribute( "id" );
                            }
                        }
                    }
                }

                return oldSelect( selector, context, results, seed, contextXML );
            };
        })();
    }

    function dirCheck( dir, checkSet, part, xml ) {
        var elem, match, isElem, nodeCheck,
            doneName = done++,
            i = 0,
            len = checkSet.length;

        if ( typeof part === "string" && !rnonWord.test( part ) ) {
            part = part.toLowerCase();
            nodeCheck = part;
        }

        for ( ; i < len; i++ ) {
            elem = checkSet[i];

            if ( elem ) {
                match = false;
                elem = elem[ dir ];

                while ( elem ) {
                    if ( elem[ expando ] === doneName ) {
                        match = checkSet[ elem.sizset ];
                        break;
                    }

                    isElem = elem.nodeType === 1;
                    if ( isElem && !xml ) {
                        elem[ expando ] = doneName;
                        elem.sizset = i;
                    }

                    if ( nodeCheck ) {
                        if ( elem.nodeName.toLowerCase() === part ) {
                            match = elem;
                            break;
                        }
                    } else if ( isElem ) {
                        if ( typeof part !== "string" ) {
                            if ( elem === part ) {
                                match = true;
                                break;
                            }

                        } else if ( filter( part, [elem] ).length > 0 ) {
                            match = elem;
                            break;
                        }
                    }

                    elem = elem[ dir ];
                }

                checkSet[i] = match;
            }
        }
    }

    var posProcess = function( selector, context, seed, contextXML ) {
        var match,
            tmpSet = [],
            later = "",
            root = context.nodeType ? [ context ] : context,
            i = 0,
            len = root.length;

        // Position selectors must be done after the filter
        // And so must :not(positional) so we move all PSEUDOs to the end
        while ( (match = matchExpr.PSEUDO.exec( selector )) ) {
            later += match[0];
            selector = selector.replace( matchExpr.PSEUDO, "" );
        }

        if ( Expr.relative[ selector ] ) {
            selector += "*";
        }

        for ( ; i < len; i++ ) {
            select( selector, root[i], tmpSet, seed, contextXML );
        }

        return filter( later, tmpSet );
    };

    // EXPOSE

    window.Sizzle = ebuy361.sizzle = Sizzle;
    ebuy361.query.matches = function( expr, set ) {
        return select( expr, document, [], set, isXML( document ) );
    };

}( window );// 声明快捷


//链头
ebuy361.array = ebuy361.array ||{};

//链头
ebuy361.dom = ebuy361.dom ||{};

//为目标元素添加className
ebuy361.addClass = ebuy361.dom.addClass ||{};

//从文档中获取指定的DOM元素
ebuy361.g = ebuy361.G = ebuy361.dom.g ||{};

//获取目标元素的属性值
ebuy361.getAttr = ebuy361.dom.getAttr ||{};

//获取目标元素的样式值
ebuy361.getStyle = ebuy361.dom.getStyle ||{};

//隐藏目标元素
ebuy361.hide = ebuy361.dom.hide ||{};

//在目标元素的指定位置插入HTML代码
ebuy361.insertHTML = ebuy361.dom.insertHTML ||{};

//通过className获取元素
ebuy361.q = ebuy361.Q = ebuy361.dom.q ||{};

//移除目标元素的className
ebuy361.removeClass = ebuy361.dom.removeClass ||{};

//设置目标元素的attribute值
ebuy361.setAttr = ebuy361.dom.setAttr ||{};

//批量设置目标元素的attribute值
ebuy361.setAttrs = ebuy361.dom.setAttrs ||{};

//按照border-box模型设置元素的height值
ebuy361.dom.setOuterHeight = ebuy361.dom.setBorderBoxHeight ||{};

//按照border-box模型设置元素的width值
ebuy361.dom.setOuterWidth = ebuy361.dom.setBorderBoxWidth ||{};

//设置目标元素的style样式值
ebuy361.setStyle = ebuy361.dom.setStyle ||{};

//批量设置目标元素的style样式值
ebuy361.setStyles = ebuy361.dom.setStyles ||{};

//显示目标元素，即将目标元素的display属性还原成默认值。默认值可能在stylesheet中定义，或者是继承了浏览器的默认样式值
ebuy361.show = ebuy361.dom.show ||{};

//链头
//ebuy361.e = ebuy361.element = ebuy361.element ||{};

//链头
ebuy361.event = ebuy361.event ||{};

//为目标元素添加事件监听器
ebuy361.on = ebuy361.event.on ||{};

//为目标元素移除事件监听器
ebuy361.un = ebuy361.event.un ||{};

//链头
ebuy361.lang = ebuy361.lang ||{};

//为类型构造器建立继承关系
ebuy361.inherits = ebuy361.lang.inherits ||{};

//链头
ebuy361.object = ebuy361.object ||{};

//链头
ebuy361.string = ebuy361.string ||{};

//对目标字符串进行html解码
ebuy361.decodeHTML = ebuy361.string.decodeHTML ||{};

//对目标字符串进行html编码
ebuy361.encodeHTML = ebuy361.string.encodeHTML ||{};

//对目标字符串进行格式化
ebuy361.format = ebuy361.string.format ||{};

//删除目标字符串两端的空白字符
ebuy361.trim = ebuy361.string.trim ||{};
 return ebuy361;
}();