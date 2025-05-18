import { Table, Model, Column, DataType, PrimaryKey } from 'sequelize-typescript';
// import { User } from 'src/user/entities/user.entity';

@Table({ tableName: 'otp', timestamps: false })
export class OTP extends Model {
    // Make `mobile` the primary key and foreign key:
    // @PrimaryKey
    // @ForeignKey(() => User)
    // @Column({ type: DataType.STRING(10), allowNull: false })
    // declare mobile: string;

    // // Set up the relationship
    // @BelongsTo(() => User, 'mobile')
    // declare user: User;

    @PrimaryKey
    @Column({ type: DataType.STRING(10), allowNull: false })
    declare mobile: string;

    @Column({
        type: DataType.STRING(6),
        allowNull: false,
        validate: {
            len: {
                args: [4, 4],
                msg: 'OTP code must be exactly 4 digits'
            },
            is: /^[0-9]{4}$/
        }
    })
    declare code: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    declare expiresAt: Date;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    declare isUsed: boolean;
}
