// It uses the sequelize-typescript library to define the model and its properties.
import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { UserRole } from 'src/common/enums/UserRole';

// import { DataTypes } from 'sequelize';  // Core ORM (Model Definitions, Queries)


@Table({
    timestamps: true,
    tableName: 'Users',
    underscored: true // Use snake_case for column names
})
export class User extends Model {
    //using ApiProperty to expose response to swagger (I think this is not needed)
    // @ApiProperty({ example: '237b395d-c73c-41c6-9d03-a93d778b0c2b', description: 'UUIDv7 Primary Key' })
    @Column({
        type: DataType.UUIDV4,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        validate: {
            isUUID: 4
        }
    })
    declare id: string;

    // @ApiProperty({ example: 'john_doe', description: 'Name' })
    @Column({
        type: DataType.STRING(20),
        validate: { len: [2, 20] },
        allowNull: true
    })
    declare name: string;

    // @ApiProperty({ example: 'john_doe@example.com', description: 'Email' })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: true,
        validate: { isEmail: true }
    })
    declare email: string;

    // @ApiProperty({ example: 'efrysy', description: 'Password' })
    @Column({
        type: DataType.STRING,
        allowNull: true,
        validate: { len: [6, 20] }
    })
    declare password: string;

    // @ApiProperty({ example: '7416815171', description: 'Mobile' })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [10, 10], is: /^[6-9]{1}[0-9]{9}$/ }
    })
    declare mobile: string;

    // @ApiProperty({ example: 'read', description: 'User Roles' })
    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.USER_READ,
        allowNull: false,
        validate: {
            isIn: [Object.values(UserRole)] // Sequelize validation
        }
    })
    declare role: UserRole; // Add 'declare' modifier

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isVerified: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isActivate: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isBlocked: boolean;
}
