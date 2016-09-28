/**
* namespace
* @param {Object}   d = document
* @param {Object}   l = location
* @return {Object}  s = localStorage
*/
;(function(d, l, s) {
    "use strict";
    var that = this,
    tasks = JSON.parse(s.getItem("tasks"));
    /**
    * Sorting elements
    * @param {Boolean} type
    * @return {Function}
    */

    function sortElements(type) {
            return function(a, b) {
            var one = a.task || a;
            var two = b.task || b;

            if (one < two) {
                return type ? 1 : -1;
            } else if (one > two) {
                return type ? -1 : 1;
            } else {
                return 0;
            }
        };
    }


    /**
    * Return the parent element DOM
    * @param {Object} tagOptions
    * @return {Object}
    */
    function findParent(tagOptions) {
        var tag;

        if (tagOptions.tagName) {
            tag = d.getElementsByTagName(tagOptions.tagName)[tagOptions.order];
        } else if (tagOptions.id)  {
            tag = d.getElementById(tagOptions.id);
        } else if (tagOptions.class) {
            tag = d.getElementsByClassName(tagOptions.class.name)[tagOptions.class.order];
        }

        return tag;
    }
    /**
    * Building a DOM element
    * @param {Object} tagOptions
    * @return {Object}
    */
    function createElement(tagOptions) {
        var tag = d.createElement(tagOptions.tagName);

        if (tagOptions.id) {
            tag.id = tagOptions.id;
        }

        if (tagOptions.class) {
            tag.className = tagOptions.class;
        }

        if (tagOptions.text) {
            tag.appendChild(d.createTextNode(tagOptions.text));
        }

        if (tagOptions.value) {
            tag.value = tagOptions.value;
        }

        if (tagOptions.type) {
            tag.type = tagOptions.type;
        }

        if (tagOptions.name) {
            tag.name = tagOptions.name;
        }

        if (tagOptions.checked) {
            tag.checked = tagOptions.checked;
        }

        if (tagOptions.listener == 'edit') {
            tag.addEventListener("click", preEditTask);
        }

        if (tagOptions.listener == 'keyPress') { 
            tag.addEventListener("keypress", saveOnEnterEditInput);
        }

        return tag;
    }
    /**
    * function on click key "Enter" in field "edit task"
    * @return {void}
    */
    function saveOnEnterEditInput() { 
        if (event.keyCode == 13 || event.which == 13) {
            d.getElementById('save_update').click();
        }
    }
    /**
    * Preparation item (title) to edit
    * @return {void}
    */
    function preEditTask() {
        if (this.firstElementChild === null) {
            var text = this.innerHTML;
            this.innerHTML = '';

            that.ToDo.creatorTag({
                type: 'insert',
                parent: {
                    id: this.getAttribute('id')
                },
                tag: {
                    tagName: 'input',
                    value: text,
                    type: 'text',
                    name: 'title',
                    listener: 'keyPress'
                }
            });

            this.firstElementChild.focus();
        }

        return;
    }

    // create property-Object Module ToDo
    that.ToDo = {
        /**
        * Object ToDo
        */
        tasks: tasks || [],
        creatorTableTasks: function(typeSorting) {
            if (this.tasks.length > 0) {
                var trOrder = 0, 
                tdOrder, i, x, q;

                tasks.sort(sortElements(typeSorting));
                d.getElementsByClassName('todo-tbody')[0].innerHTML = "";
                // Add trs
                for (i = 0; i <= (this.tasks.length - 1); i++) {
                    trOrder++;
                    this.creatorTag({
                        type: 'insert',
                        parent: {
                            class: {
                                name: 'todo-tbody',
                                order: 0
                            }
                        },
                        tag: {
                            tagName: 'tr'
                        }
                    });
                    // Add tds
                    for (x = 0; x <= 2; x++) {
                        if (x === 0) {
                            this.creatorTag({
                                type: 'insert',
                                parent: {
                                    tagName: 'tr',
                                    order: trOrder
                                },
                                tag: {
                                    tagName: 'td',
                                    text: this.tasks[i].task,
                                    id: 'task_' + i,
                                    listener: 'edit'
                                }
                            });
                        } else {
                            this.creatorTag({
                                type: 'insert',
                                parent: {
                                    tagName: 'tr',
                                    order: trOrder
                                },
                                tag: {
                                    tagName: 'td'
                                }
                            });
                        }
                    }

                    // Add checkboxes
                    for (q = 0; q <= 2; q++) {
                        if (q == 1) {
                            tdOrder = trOrder * 3 - (q + 1);
                            this.creatorTag({
                                type: 'insert',
                                parent: {
                                    tagName: 'td',
                                    order: tdOrder
                                },
                                tag: {
                                    tagName: 'input',
                                    value: String(i),
                                    type: 'checkbox',
                                    name: 'ready',
                                    checked: this.tasks[i].check ? true : false
                                }
                            });
                        } else if (q == 2) {
                            tdOrder = trOrder * 3 - 1;
                            this.creatorTag({
                                type: 'insert',
                                parent: {
                                    tagName: 'td',
                                    order: tdOrder
                                },
                                tag: {
                                    tagName: 'input',
                                    value: String(i),
                                    type: 'checkbox',
                                    name: 'delete'
                                }
                            });
                        }
                    }
                }

                d.getElementById('welcome_message').style.display = 'none';
                d.getElementById('todo_form').style.display = 'block';
            } else {
                d.getElementById('welcome_message').style.display = 'block';
                d.getElementById('todo_form').style.display = 'none';
            }
        },
        /**
        * DOM node creation method
        * @param {Object} tagOptions
        * @return {void}
        */
        creatorTag: function(tagOptions) {
            var parent, before, sibling;

            switch (tagOptions.type) {
                case 'insert': // If create a insert-element
                    parent = findParent(tagOptions.parent);
                    if (tagOptions.parent) {
                        parent.appendChild(createElement(tagOptions.tag));
                    }
                    break;
                case 'before': // If create a before-element
                    parent = findParent(tagOptions.parent);
                    before = findParent(tagOptions.before);
                    parent.insertBefore(createElement(tagOptions.tag), before);
                    break;
                case 'after': // If create a after-element
                    sibling = findParent(tagOptions.sibling);
                    sibling.parentNode.insertBefore(createElement(tagOptions.tag), sibling.nextSibling);
                    break;
            }
        },
        /**
        * The method of setting the task list storage
        * @param {Array} arrComplited
        * @param {Array} arrDeleted
        * @param {Array} arrTitles
        * @return {action}
        */
        customizerTasks: function(arrComplited, arrDeleted, arrTitles) {
            var i;
            if (this.tasks) {

                if (arrComplited.length > 0) {
                    for (i = 0; arrComplited.length > i; i++) {
                        if (arrDeleted.indexOf(arrComplited[i]) == -1) {
                            this.tasks[arrComplited[i]].check = true;
                        }
                    }
                }

                if (arrTitles.length > 0) {
                    for (i = 0; arrTitles.length > i; i++) {
                        if (arrDeleted.indexOf(arrTitles[i].title) == -1) {
                            this.tasks[arrTitles[i].title].task = arrTitles[i].text;
                        }
                    }
                } 

                if (arrDeleted.length > 0) {
                    arrDeleted.sort(sortElements(true)).forEach(function(element, index) {
                        that.ToDo.tasks.splice(element, 1);
                    });
                }
                // Если задача была снова отмечена, как невыполненная
                this.tasks.forEach(function(element,index) {
                    if (element.check == 1 && arrComplited.indexOf(String(index)) == -1) {
                        that.ToDo.tasks[index].check = false;
                    }
                });

                s.removeItem("tasks");
                s.setItem("tasks", JSON.stringify(this.tasks));
                this.creatorTableTasks(true);
            }
        },
    };

    /* Event handlers */
    // Handler click on the "Сохранить"
    d.getElementById('save_task').addEventListener('click', function(event) {
        var newTask = d.getElementById('new_task').value.trim();
        event.preventDefault();

        if (newTask === '') {
            d.getElementById('task_error').style.display = 'block';
            return;
        } else {
            d.getElementById('task_error').style.display = 'none';
        }

        if (that.ToDo.tasks.length > 0) {
            that.ToDo.tasks.push({
                task: newTask,
                check: false
            });
        } else {
            that.ToDo.tasks = [{
                task: newTask,
                check: false
            }];
        }

        s.setItem("tasks", JSON.stringify(that.ToDo.tasks));
        that.ToDo.creatorTableTasks(true);
    });
    // Handler click on the "Сохранить изминения"
    d.getElementById('save_update').addEventListener('click', function(event) {
        var trs = d.getElementsByClassName('todo-tbody')[0].children,
        arrComplited = [], 
        arrDeleted = [], 
        arrTitles = [], 
        i, 
        x;

        event.preventDefault();
     
        for (i = 0; trs.length > i; i++) {
            for (x = 0; trs[i].children.length > x; x++) {
                if (x > 0) {
                    if (trs[i].children[x].firstChild.checked && trs[i].children[x].firstChild.getAttribute('name') == 'ready') {
                        arrComplited.push(trs[i].children[x].firstChild.value);
                    }

                    if (trs[i].children[x].firstChild.checked && trs[i].children[x].firstChild.getAttribute('name') == 'delete') {
                        arrDeleted.push(trs[i].children[x].firstChild.value);
                    }
                } else {
                    if (trs[i].children[x].firstElementChild) {
                        arrTitles.push({
                            title: trs[i].children[x].getAttribute('id').replace('task_', ''),
                            text: trs[i].children[x].firstElementChild.value
                        });
                    }
                }
            }
        }

        that.ToDo.customizerTasks(arrComplited, arrDeleted, arrTitles);
    });
    // Handler click on the "Список задач" (sorting)
    d.getElementById('tab_sort').addEventListener('click', function(event) {
        that.ToDo.creatorTableTasks(!this.getAttribute('class'));

        if (this.getAttribute('class')) {
            this.removeAttribute('class');
        } else {
            this.setAttribute('class', 'active-sort');
        }
    });

}.call(window, document, location, localStorage));

// The initial output of the task list. Welcome )
window.ToDo.creatorTableTasks(true);