(function () {
    'use strict'


    function SK_Pagination(el, options) {
        this.$sourceTarget = this.createElement(el);
        this.options = $.extend({}, this.defaultOptions, options);
        this.createInstance();
        return this;
    }

    SK_Pagination.prototype = {
        constructor: SK_Pagination,
        defaultOptions: {
            currentPage: 1,
            startPage: 1,
            endPage: 1,
            totalPages: 5,
            visiblePages: 5,
            datas: [],
            onePageDataCount: 5,
            prevNext: true,
            FirstLast: true,
            onPageClick: null,
            clickPageEvent: null,
            wrapperClass: 'sk-pagination-wrp',
            contentClass: 'sk-content',
            paginationClass: 'sk-pagination',
            firstClass: 'first',
            firstText: 'First',
            prevClass: 'prev',
            prevText: 'Prev',
            nextClass: 'next',
            nextText: 'Next',
            lastClass: 'last',
            lastText: 'Last',
            actvieClass: 'active'
        },
        createInstance: function () {
            this.$sourceTarget.data('SK_Pagination', this);

            this.calcTotalPages();
            this.checkTotalPage();
            this.resetRightEndPage();
            this.resetRightCurrentPage();

            this.createWrp();
            this.createContent();
            this.createPagination();
            
            this.$element = this.$wrapper.append(this.$content).append(this.$pagination);
            this.setupEvent();
            this.buildPageItems();
            this.loadCurrentPageData();

            this.$sourceTarget.append(this.$element);

            return this.$element;
        },
        createWrp: function () {
            this.$wrapper = this.createElement('<div class="' + this.options.wrapperClass + '"></div>');

            return this.$wrapper;
        },
        createContent: function () {
            this.$content = this.createElement('<div class="' + this.options.contentClass + '"></div>');

            return  this.$content;
        },
        createPagination: function () {
            this.$pagination = this.createElement('<ul class="' + this.options.paginationClass + '"></ul>');

            return  this.$pagination;
        },
        createPageItem: function (page, clz = '') {
            var _this = this;
            var $item;

            if (clz !== '') {
                $item = _this.createElement('<li class="' + clz + '"><a href="#">' + page + '</a></li>');
            } else {
               $item = _this.createElement('<li><a href="#">' + page + '</a></li>');
            }

            if (page === _this.options.currentPage) {
                $item.addClass('active');
            }

            $item.data('page', page).on('click', function (ev) { 
                _this.eventHandle.itemPageClick.apply(this,[_this, ev]); 
            });

            return $item;
        },
        createElement: function (el) {
            return $(el);
        },
        buildPageItems: function () {
            this.$pagination.empty();
            
            for (var i = this.options.startPage; i<=this.options.endPage; i++) {
                var $item = this.createPageItem(i);
                this.$pagination.append($item);
            }
        },
        loadCurrentPageData: function () {
            var sliceData;
            if (this.options.currentPage === 1) {
                sliceData = this.options.datas.slice(0, this.options.onePageDataCount);
            } else {
                sliceData = this.options.datas.slice((this.options.currentPage - 1) * this.options.onePageDataCount, this.options.currentPage * this.options.onePageDataCount);
            }
            this.$element.trigger('clickPageEvent', [this.$element, sliceData]);
        },
        calcTotalPages: function () {
            if (this.options.datas.length === 0) {
                this.options.totalPages = 1;
            } else {
                var t = Math.floor(this.options.datas.length / this.options.onePageDataCount);
                var m = this.options.datas.length % this.options.onePageDataCount;
                if (m !== 0) {
                    this.options.totalPages = t + 1;
                } else {
                    this.options.totalPages = t;
                }  
            }          
        },
        checkTotalPage: function () {
            if (this.options.visiblePages > this.options.totalPages) {
                this.options.visiblePages = this.options.totalPages
            }
        },
        resetRightEndPage: function () {
            if ((this.options.startPage + this.options.visiblePages) > this.options.totalPages) {
                this.options.startPage = this.options.totalPages - this.options.visiblePages + 1;
            }
            this.options.endPage = this.options.startPage + this.options.visiblePages - 1;
        },
        resetRightCurrentPage: function () {
            if (this.options.currentPage < this.options.startPage || this.options.currentPage > this.options.endPage) {
                this.options.currentPage = this.options.startPage;
            }
        },
        eventHandle: {
            itemPageClick: function (_this, ev) {
                _this.eventHandle.reBulidPageItems.apply(this, [_this, ev]);
                _this.loadCurrentPageData();
            },
            reBulidPageItems: function (_this, ev) {
                _this.options.currentPage = $(this).data('page');

                var offset = Math.floor((_this.options.endPage - _this.options.startPage + 1) / 2);
                var midPage = _this.options.startPage + offset;
                if (_this.options.currentPage > midPage) {
                    _this.options.startPage += _this.options.currentPage - midPage;
                    if ((_this.options.startPage + _this.options.visiblePages) > _this.options.totalPages) {
                        _this.options.startPage = _this.options.totalPages - _this.options.visiblePages + 1;
                    }
                    _this.options.endPage = _this.options.startPage + _this.options.visiblePages - 1;
                } else if (_this.options.currentPage < midPage) {
                    _this.options.startPage -= midPage - _this.options.currentPage;
                    if (_this.options.startPage < 1) {
                        _this.options.startPage = 1;
                    }
                    _this.options.endPage = _this.options.startPage + _this.options.visiblePages - 1;
                }

                _this.buildPageItems();
            }
        },
        setupEvent: function () {
            if (typeof this.options.clickPageEvent === 'function') {
                this.$element.on('clickPageEvent', this.options.clickPageEvent);
            } else {
                throw new Error('require impl clickPageEvent event.');
            }
        }
    };

    $.fn.SK_Pagination = function (options) {
        var instance = new SK_Pagination(this, options);
        console.log(instance);
        return instance;
    };
})();