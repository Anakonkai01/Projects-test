// service-products/utils/apiFeatures.js

class APIFeatures {
    constructor(query, queryString) {
        this.query = query; // Ví dụ: Product.find()
        this.queryString = queryString; // Ví dụ: req.query
    }

    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i' // không phân biệt hoa thường
            }
        } : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryString };
        
        // Xóa các trường đặc biệt
        const removeFields = ['keyword', 'page', 'limit', 'sort'];
        removeFields.forEach(key => delete queryCopy[key]);

        // Xử lý lọc theo khoảng giá (gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        // === BẮT ĐẦU CHỈNH SỬA ===
        if (this.queryString.sort) {
            let sortBy;
            // Kiểm tra các giá trị sắp xếp tùy chỉnh
            if (this.queryString.sort === 'priceAsc') {
                sortBy = 'price'; // Sắp xếp theo giá tăng dần
            } else if (this.queryString.sort === 'priceDesc') {
                sortBy = '-price'; // Sắp xếp theo giá giảm dần
            } else {
                // Giữ logic cũ nếu là các trường khác (ví dụ: -createdAt, name)
                sortBy = this.queryString.sort.split(',').join(' ');
            }
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt'); // Mặc định sắp xếp theo ngày tạo mới nhất
        }
        // === KẾT THÚC CHỈNH SỬA ===
        return this;
    }
    pagination() {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 8;
        const skip = (page - 1) * limit;

        this.query = this.query.limit(limit).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;