module.exports = {
  all: true,
  reporter: ['clover', 'json', 'lcov'],
  include: ['src/**/*.{js,jsx}'],
  exclude: ['node_modules', 'e2e', '**/__mocks__/**', '**/__tests__/**', 'src/setupTests.js'],
}
