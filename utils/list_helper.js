
const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    var sum = 0
    blogs.forEach(b => {
        sum += b.likes    
    })
    return sum
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    var mostLikes = 0
    blogs.forEach(b => {
        mostLikes = Math.max(mostLikes, b.likes)
    })
    return blogs.find(b => b.likes === mostLikes)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}