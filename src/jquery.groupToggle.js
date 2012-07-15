/*!
 * jQuery groupToggle plugin
 * A jQuery plugin for creating a toggle that checks/unchecks a group of checkboxes.
 *
 * https://github.com/toXXIc/jquery.groupToggle
 *
 * Copyright (c) 2012 Basil Gren
 * Released under the MIT license.
 *
 * @version 1.0.0, 29-May-2012
 */

(function ($) {
    var PLUGIN_NAME = 'groupToggle'; // The name of plugin

    var defaults = {
        filter:null, // Filter
        groupParent:null, // Parent of checkbox group. Filter is applied to parent. Default parent is <body> element
        toggleOffClass:'',
        toggleOnClass:'checked'
    };


    /**
     * Tries to extract method from passed arguments.
     * @param pluginArgs Arguments that was passed to jQuery plugin.
     */
    function _extractMethod(pluginArgs) {
        if (typeof pluginArgs[0] == 'string')
            return { name:pluginArgs[0], params:Array.prototype.slice.call(pluginArgs, 1)};

        return null;
    }


    /**
     * Invokes method of api object if it exists.
     *
     * @param api API object which method will be called.
     * @param methodInfo Object that should contain information about method to be called.
     *      It should contain 'name' property with method's name and 'params' property with
     *      array of parameters to be passed to the method.
     */
    function _invokeMethod(api, methodInfo) {
        if (api.hasOwnProperty(methodInfo.name)) {
            var method = api[methodInfo.name];
            if (typeof method == 'function')
                method.apply(api, methodInfo.params);
        }
    }


    /**
     * Returns plugin api object that is bound to element data. If api is not defined,
     * createCallback function is called. Created api is bound to the element data under PLUGIN_NAME.
     * If API is already initialized, function checks methodInfo parameter and invokes method if necessary.
     *
     * @param elem Element on which plugin is applied.
     * @param methodInfo Should contain the result of execution _extractMethod function.
     * @param createCallback Function that should retrieve new instance of plugin API object.
     */
    function _initPluginAPI(elem, methodInfo, createCallback) {
        var api = $.data(elem, PLUGIN_NAME);
        if (api) {
            if (methodInfo)
                _invokeMethod(api, methodInfo);
        }
        else {
            api = createCallback.apply(elem);
            $.data(elem, PLUGIN_NAME, api);
        }

        return api;
    }


    /**
     * Function normalizes options passed to plugin function.
     *
     * @param arguments Arguments that passed to plugin function.
     */
    function _normalizeOptions(args) {
        var options = {};

        if (args.length > 0) {
            if (typeof args[0] == 'object')
                if (args[0] instanceof jQuery)
                    options.filter = args[0];
                else
                    options = args[0];
            else
                options.filter = args[0];

            // Now process 2nd argument if present.
            if ((args.length > 1) && (typeof args[1] == 'object'))
                options = $.extend(true, options, args[1]);
        }


        if (!options.groupParent)
            options.groupParent = $('body');
        if (!(options.groupParent instanceof jQuery))
            options.groupParent = $(options.groupParent);

        // Merge defaults with passed options
        return $.extend(true, {}, defaults, options);
    }


    $.fn[PLUGIN_NAME] = function (/* arguments */) {
        var methodInfo = _extractMethod(arguments);
        var options = _normalizeOptions(arguments);


        return this.each(function () {
            _initPluginAPI(this, methodInfo, function () {
                return new Plugin(this, options);
            });

            return this;
        });
    };


    /**
     * Plugin object.
     *
     * @param elem Element on which plugin is applied.
     * @param options
     */
    function Plugin(elem, options) {
        // TODO: Move methods to prototype.

        this.elem = elem;
        this.options = options;

        // Methods
        this.update = update;
        this.check = check;
        this.uncheck = uncheck;


        // Private
        var group = null;
        var internalUpdate = false;
        var $toggle = $(elem);
        var isCheckboxToggle = $toggle.is('input:checkbox');

        // Check input field type and name presence
        if (isCheckboxToggle)
            $toggle.change(toggleClicked);
        else
            $toggle.click(toggleClicked);

        options.groupParent.on('change', options.filter, syncToggle);

        update();

        return this;

        // ====================================================


        function toggleClicked() {
            var state = isCheckboxToggle ? this.checked : !$toggle.hasClass(options.toggleOnClass);

            setGroupState(group, state);
        }


        function setGroupState($group, state) {
            internalUpdate = true;
            for (var i = 0, count = $group.length; i < count; i++) {
                var checkbox = $group[i];
                // Process one by one, because we need to check what checkbox is changed and which is none.
                var oldState = checkbox.checked;
                checkbox.checked = state;

                // Attention! This is the slowest part of this function. Maybe there's some way to optimize it.
                // If firing change events is unnecessary, it can be disabled.
                // Actually, delay is noticeable when the group has hundreds of checkboxes.
                if (oldState != state)
                    $(checkbox).change();
            }

            internalUpdate = false;

            syncToggle();
        }


        /**
         * Updates toggle state to match states of group checkboxes.
         */
        function syncToggle() {
            // Protection from multiple calls invoked by setGroupState method.
            if (internalUpdate) return;

            var checkedCount = 0;
            var totalCount = group.length;

            for (var i = 0; i < totalCount; i++)
                if (group[i].checked) checkedCount++;

            var state = (checkedCount == totalCount);

            if (isCheckboxToggle)
                elem.checked = state;
            else {
                if (state) {
                    $toggle.addClass(options.toggleOnClass);
                    $toggle.removeClass(options.toggleOffClass);
                }
                else {
                    $toggle.addClass(options.toggleOffClass);
                    $toggle.removeClass(options.toggleOnClass);
                }
            }
        }


        function check() {
            setGroupState(group, true);
        }


        function uncheck() {
            setGroupState(group, false);
        }

        /**
         * Updates the group and synchronizes state of the toggle depending on states of the group checkboxes.
         */
        function update() {
            // Initialize group
            group = options.groupParent.find('input:checkbox');
            if (options.filter)
                group = group.filter(options.filter);

            syncToggle();
        }
    }

})(jQuery);